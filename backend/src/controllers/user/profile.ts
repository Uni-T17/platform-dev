import { Request, Response, NextFunction } from "express";
import { getUserById } from "../../services/authServices";
import {
  checkCreditsExist,
  checkTractionHistoryExist,
  checkUserNotExist,
} from "../../utils/check";
import { CurrentUserProfileType } from "../../type/profileType";
import { getTransactionHistoryByUserId } from "../../services/transactionService";
import { getCreditsByOwnerId } from "../../services/creditsServices";
import { getBookCountByOwnerId } from "../../services/bookServices";

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
  const transactionHistory = await getTransactionHistoryByUserId(user!.id);
  checkTractionHistoryExist(transactionHistory);
  const credits = await getCreditsByOwnerId(user!.id);
  checkCreditsExist(credits);
  const bookListed = await getBookCountByOwnerId(user!.id);

  const resData: CurrentUserProfileType = {
    profileCard: {
      name: user!.name,
      email: user!.email,
      rating: transactionHistory!.averageRating,
      memberSince: user!.createdAt,
      bio: user!.bio,
      liveIn: user!.address,
    },
    creditsBalance: credits!.balance,
    bookListed: bookListed,
    exchanges: transactionHistory!.transactionCount,
    contactInfo: {
      phone: user!.phone,
      address: user!.address,
      prefferedContact: user!.preferredContact,
    },
  };

  res.status(200).json({
    message: "Success",
    data: resData,
  });
};
