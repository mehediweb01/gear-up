import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handleCompleted = async (session: Stripe.Checkout.Session) => {
  const payment = await prisma.payment.findUnique({
    where: {
      stripeSessionId: session.id,
    },
  });

  if (!payment) return;

  await prisma.$transaction(async (tx) => {
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
        transactionId: `TRXID ${session.payment_intent as string}${new Date()}`,
      },
    });

    await prisma.rentalOrder.update({
      where: {
        id: payment.rentalId,
      },
      data: {
        status: "PAID",
      },
    });
  });
};

export const handleFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  await prisma.payment.updateMany({
    where: {
      transactionId: paymentIntent.id,
    },
    data: {
      status: "FAILED",
    },
  });
};

export const handleExpired = async (session: Stripe.Checkout.Session) => {
  await prisma.payment.updateMany({
    where: {
      stripeSessionId: session.id,
    },
    data: {
      status: "FAILED",
    },
  });
};
