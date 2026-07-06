import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminServices } from "./admin.services";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const category = await adminServices.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Category created successfully!",
      data: category,
    });
  },
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await adminServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully!",
      data: users,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await adminServices.updateUserStatus(
      id as string,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User status updated successfully!",
      data: updatedUser,
    });
  },
);

export const adminController = {
  createCategory,
  getAllUsers,
  updateUserStatus,
};
