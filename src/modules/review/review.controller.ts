import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user.id as string;
    const payload = req.body;

    const review = await reviewServices.createReview(customerId, payload);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Review created successfully!",
      data: review,
    });
  },
);

export const reviewController = {
  createReview,
};
