import { NextFunction, Request, Response } from "express";

export const errorHandler = async (
  error: TypeError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errorMessage = error.message || "Something went wrong!";
  return res.status(500).json({
    success: false,
    message: errorMessage,
    stack: error.stack,
  });
};
