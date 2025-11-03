import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: number;
}

export const buyerReviewSeller = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.status(201).json({ message: "Review created successfully" });
};
