import { Request, Response, NextFunction } from "express";

export const register = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Hello" });
};
