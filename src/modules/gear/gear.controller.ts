import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { gearServices } from "./gear.services";

const addGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user.id;

    const gear = await gearServices.addGear(payload, userId);

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
    const userId = req.user.id;

    const updatedGear = await gearServices.updateGear(
      payload,
      gearId as string,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Gear updated successfully!",
      data: updatedGear,
    });
  },
);

const deleteGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.id;
    const userId = req.user.id;

    await gearServices.deleteGear(gearId as string, userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Gear deleted successfully!",
      data: null,
    });
  },
);

const getAllGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gears = await gearServices.getAllGears();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Gears retrieved successfully!",
      data: gears,
    });
  },
);

export const gearController = {
  addGear,
  updateGear,
  deleteGear,
  getAllGears,
};
