import { Request, Response, NextFunction } from "express";
import { getUserById } from "../../services/authServices";
import { checkUserNotExist } from "../../utils/check";

interface CustomRequest extends Request {
  userId?: number;
}

export const getCurrentUserProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserNotExist(user);

  res.status(200).json({
    message: "Success",
    name: user!.name,
    email: user!.email,
    bio: user!.bio,
    address: user!.address,
  });
};
