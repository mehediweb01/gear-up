import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.services";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServices.registerUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User register successfully!",
      data: user,
    });
  },
);

export const userController = {
  registerUser,
};
