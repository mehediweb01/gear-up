import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createPayment = async (
  orderId: string,
  userId: string,
): Promise<Stripe.Checkout.Session> => {
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
    throw new Error("You are not authorized to create payment for this order!");
  }

  if (order.status === "PAID") {
    throw new Error("Order is already paid!");
  }

  const rentalDays =
    new Date(order.endDate).getDate() - new Date(order.startDate).getDate();

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

  return session;
};

export const paymentServices = {
  createPayment,
};
