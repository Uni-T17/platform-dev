import { createError, errorCode } from "./error";

export const checkUserAlreadyExist = (user: any) => {
  if (user) {
    return createError("User Already Exist", 400, errorCode.userExist);
  }
};
export const checkSameDateAndError = (isSameDate: boolean, error: number) => {
  if (isSameDate && error >= 5) {
    return createError(
      "You Can't access for today for 5 errors!",
      405,
      errorCode.overLimit
    );
  }
};
