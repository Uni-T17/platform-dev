import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError, errorCode } from "../utils/error";
import {
  createOtp,
  getOtpByEmail,
  getUserByEmail,
  updateOtp,
} from "../services/authServices";
import { checkSameDateAndError, checkUserAlreadyExist } from "../utils/check";
import { generateOtp, generateToken } from "../utils/generate";
import bcrypt from "bcrypt";

export const register = [
  body("email", "Invalid Email Address!")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email address."),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const email = req.body.email;
    const user = await getUserByEmail(email);
    checkUserAlreadyExist(user);

    // generate
    const otp = generateOtp();

    // crypt otp for safety
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp.toString(), salt);

    const rememberToken = generateToken();

    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 5);

    let result;
    let otpData;
    const otpRow = await getOtpByEmail(email);

    if (!otpRow) {
      otpData = {
        email: email,
        otp: hashOtp,
        rememberToken: rememberToken,
        count: 1,
        expiredAt: expiredAt,
      };
      // Create new Otp
      result = await createOtp(otpData);
    } else {
      const today = new Date().toLocaleDateString();
      const lastUpdated = new Date(otpRow.updatedAt).toLocaleDateString();
      const isSameDate = today === lastUpdated;
      let count;
      // if error(wrong Otp) within a day is more than 5
      checkSameDateAndError(isSameDate, otpRow.error);
      // if not same date let count one
      if (isSameDate) {
        count = otpRow.count + 1;
      } else {
        count = 1;
      }

      // if same date check count of request if more than 3 limit request
      if (count > 3) {
        return next(
          createError(
            "You can only request 3 otp per day!",
            405,
            errorCode.overLimit
          )
        );
      }
      otpData = {
        otp: hashOtp,
        rememberToken: rememberToken,
        count: count,
        expiredAt: expiredAt,
      };
      result = await updateOtp(otpRow.id, otpData);
    }

    res.status(200).json({
      message: `Otp is successfully sent to ${result.email}`,
      email: email,
      otp: hashOtp,
      rememberToken: result.rememberToken,
      expiredAt: `The otp will be expired within 5 minutes.`,
    });
  },
];
