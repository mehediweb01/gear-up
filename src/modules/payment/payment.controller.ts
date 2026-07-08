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
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

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

const getPaymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id as string;
    const paymentId = req.params.id as string;

    const payment = await paymentServices.getPaymentDetails(paymentId, userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment retrieved successfully!",
      data: payment,
    });
  },
);

export const paymentController = {
  createPayment,
  stripeWebhook,
  getUserPayments,
  getPaymentDetails,
};
