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

export const paymentController = {
  createPayment,
};
