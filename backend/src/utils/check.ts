import { createError, errorCode } from "./error";
import { removeFile } from "./file";

export const checkUserAlreadyExist = (user: any) => {
  if (user) {
    throw createError("User Already Exist", 400, errorCode.userExist);
  }
};
export const checkSameDateAndError = (isSameDate: boolean, error: number) => {
  if (isSameDate && error >= 5) {
    throw createError(
      "You Can't access for today for 5 errors!",
      405,
      errorCode.overLimit
    );
  }
};

export const checkOtpRowNotExist = (otpRow: any) => {
  if (!otpRow) {
    throw createError("Otp doesn't exist", 400, errorCode.invalid);
  }
};

export const checkUserNotExist = (user: any) => {
  if (!user) {
    throw createError("User doesn't exist!", 400, errorCode.invalid);
  }
};

export const checkRefreshTokenExist = (refreshToken: string) => {
  if (!refreshToken) {
    throw createError(
      "Your are not an unauthenticated User",
      401,
      errorCode.unauthenticated
    );
  }
};

export const checkTractionHistoryExist = (transactionHistory: any) => {
  if (!transactionHistory) {
    throw createError(
      "TransactionHistory is not exists!",
      404,
      errorCode.invalid
    );
  }
};

export const checkCreditsExist = (credits: any) => {
  if (!credits) {
    throw createError("Credits is not exists!", 404, errorCode.invalid);
  }
};

export const checkImageNotExist = (file: any) => {
  if (!file) {
    throw createError("Invalid File!!!", 404, errorCode.invalid);
  }
};

export const checkUserNotExistAndRemoveImage = async (
  user: any,
  fileName: string
) => {
  if (!user) {
    await removeFile(fileName!);
    throw createError(
      "This phone number is not registered yet!",
      401,
      errorCode.unauthorised
    );
  }
};

export const checkBookNotExist = (book: any) => {
  if (!book) {
    throw createError("Book Is not existed!!!", 404, errorCode.invalid);
  }
};
export const checkContactInfoExist = (buyer: any) => {
  const address = buyer.address?.trim() || "";
  const phone = buyer.phone?.trim() || "";

  // If both missing or empty
  if (!address && !phone) {
    throw createError(
      "User needs to fill contact info first!",
      404,
      errorCode.invalid
    );
  }
};

export const checkModelNotExist = (model: any, name: string) => {
  if (!model) {
    throw createError(`${name} is not exists!`, 404, errorCode.invalid);
  }
};
