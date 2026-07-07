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

const getOrderDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id as string;

    const order = await rentalServices.getOrderDetails(orderId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Order retrieved successfully!",
      data: order,
    });
  },
);

const getIncomingOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id as string;

    const orders = await rentalServices.getIncomingOrders(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Incoming orders retrieved successfully!",
      data: orders,
    });
  },
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id as string;
    const orderId = req.params.id as string;
    const { status } = req.body;

    const updatedOrderStatus = await rentalServices.updateOrderStatus(
      userId,
      orderId,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Order status updated successfully!",
      data: updatedOrderStatus,
    });
  },
);

const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await rentalServices.getAllOrders();

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
  getOrderDetails,
  getIncomingOrders,
  updateOrderStatus,
  getAllOrders,
};
