import { createError, errorCode } from "./error";

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
