import { Response } from "express";

interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

const sendResponse = <T>(
  res: Response,
  { success, statusCode = 200, message, data }: IResponse<T>,
) => {
  res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
  });
};

export default sendResponse;
