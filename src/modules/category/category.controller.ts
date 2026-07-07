import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.service";

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryServices.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Categories retrieved successfully!",
      data: categories,
    });
  },
);

export const categoryController = {
  getAllCategories,
};
