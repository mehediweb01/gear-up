import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUsers();

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

    const updatedUser = await userServices.updateUserStatus(
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

export const userController = {
  getAllUsers,
  updateUserStatus,
};
