import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { rentalServices } from "./rental.service";

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user.id as string;
    const { gearId, quantity, startDate, rentalDays } = req.body;

    const payload = {
      customerId,
      gearId,
      quantity,
      startDate,
      rentalDays,
    };

    const order = await rentalServices.createOrder(payload);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Order created successfully!",
      data: order,
    });
  },
);

const getUserOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id as string;

    const orders = await rentalServices.getUserOrders(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Orders retrieved successfully!",
      data: orders,
    });
  },
);

export const rentalController = {
  createOrder,
  getUserOrders,
};
