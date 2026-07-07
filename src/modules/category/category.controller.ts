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

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const category = await categoryServices.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Category created successfully!",
      data: category,
    });
  },
);

export const categoryController = {
  getAllCategories,
  createCategory,
};
