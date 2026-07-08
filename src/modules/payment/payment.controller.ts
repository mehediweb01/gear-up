import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { orderId } = req.body;

    const payments = await paymentServices.createPayment(orderId, userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment created successfully!",
      data: payments,
    });
  },
);

const stripeWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(`hit the webhook`);

    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    console.log("event:", event);
    console.log(`signature: `, signature);

    await paymentServices.stripeWebhook(event, signature);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "webhook triggered successfully!",
      data: null,
    });
  },
);

const getUserPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id as string;

    const payments = await paymentServices.getUserPayments(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payments retrieved successfully!",
      data: payments,
    });
  },
);

export const paymentController = {
  createPayment,
  stripeWebhook,
  getUserPayments,
};
