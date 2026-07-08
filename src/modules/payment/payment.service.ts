import Stripe from "stripe";
import { paymentStatus } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCompleted, handleExpired, handleFailed } from "./payment.utils";

const createPayment = async (orderId: string, userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const order = await prisma.rentalOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        customer: true,
        gear: true,
      },
    });

    if (!order) throw new Error("Order not found!");

    if (order.customerId !== userId) {
      throw new Error(
        "You are not authorized to create payment for this order!",
      );
    }

    if (order.status === "PAID") {
      throw new Error("Order is already paid!");
    }

    const rentalDays = Math.ceil(
      (order.endDate.getTime() - order.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (rentalDays <= 0) {
      throw new Error("End date must be after start date.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customer.email,

      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: order.gear.title,
              images: [order.gear.image],
            },
            unit_amount: order.gear.pricePerDay * rentalDays * 100,
          },
          quantity: order.quantity,
        },
      ],
      metadata: {
        userId,
        orderId,
      },
      success_url: `${config.app_url}/payment/success`,
      cancel_url: `${config.app_url}/payment/cancel`,
    });

    if (!session) {
      throw new Error("Failed to create checkout session");
    }

    await prisma.payment.create({
      data: {
        amount: order.totalPrice,
        rentalId: order.id,
        customerId: order.customerId,
        method: "STRIPE",
        status: paymentStatus.PENDING,
        stripeSessionId: session.id,
        paidAt: null,
        transactionId: null,
      },
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  });

  return {
    sessionId: transactionResult.sessionId,
    paymentUrl: transactionResult.checkoutUrl,
  };
};

const stripeWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret!;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case "checkout.session.expired":
      await handleExpired(event.data.object as Stripe.Checkout.Session);
      break;

    case "payment_intent.payment_failed":
      await handleFailed(event.data.object as Stripe.PaymentIntent);
      break;
  }
};

const getUserPayments = async (userId: string) => {
  if (!userId) {
    throw new Error("User id is required!");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  const payments = await prisma.payment.findMany({
    where: {
      customerId: user.id,
    },
  });

  return payments;
};

export const paymentServices = {
  createPayment,
  stripeWebhook,
  getUserPayments,
};
