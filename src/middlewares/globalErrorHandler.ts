import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../prisma/generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: any = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation Error";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case "P2002":
        message = "Duplicate value. This record already exists.";
        break;

      case "P2025":
        statusCode = 404;
        message = "Record not found.";
        break;

      case "P2003":
        message = "Foreign key constraint failed.";
        break;

      default:
        message = err.message;
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 400;
    message = err.message;

    switch (err.errorCode) {
      case "P1000":
        message =
          "Authentication failed against database server. Please Check Your Credentials";
        break;

      case "P1001":
        message = "Can't reach database server";
        break;
    }
  } else if (err instanceof Error) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    stack: err.stack,
  });
};
