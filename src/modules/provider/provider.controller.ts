import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { providerServices } from "./provider.services";

const addGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user.id;

    const gear = await providerServices.addGear(payload, userId);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "new gear added successfully!",
      data: gear,
    });
  },
);

const updateGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const gearId = req.params.id;

    const updatedGear = await providerServices.updateGear(
      payload,
      gearId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Gear updated successfully!",
      data: updatedGear,
    });
  },
);

export const providerController = {
  addGear,
  updateGear,
};
