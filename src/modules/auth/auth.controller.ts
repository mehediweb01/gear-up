import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.services";

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } = await authServices.userLogin(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User login successfully!",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;

    const user = await authServices.getMe(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Authenticated user retrieved successfully!",
      data: user,
    });
  },
);

export const authController = {
  userLogin,
  getMe,
};
