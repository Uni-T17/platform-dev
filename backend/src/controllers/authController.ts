import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError, errorCode } from "../utils/error";
import {
  createNewUser,
  createOtp,
  getOtpByEmail,
  getUserByEmail,
  getUserById,
  updateOtp,
  updateUser,
} from "../services/authServices";
import {
  checkOtpRowNotExist,
  checkRefreshTokenExist,
  checkSameDateAndError,
  checkUserAlreadyExist,
  checkUserNotExist,
} from "../utils/check";
import { generateOtp, generateToken } from "../utils/generate";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

export const register = [
  body("email", "Invalid Email Address!").trim().notEmpty().isEmail(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const email = req.body.email;
    const user = await getUserByEmail(email);
    checkUserAlreadyExist(user);

    // generate
    // const otp = generateOtp();
    const otp = 123456; // Only for development

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
            429,
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
      rememberToken: result.rememberToken,
      expiredAt: `The otp will be expired within 5 minutes.`,
    });
  },
];

export const verifyOtp = [
  body("email", "Invalid Email Address!").trim().notEmpty().isEmail(),
  body("otp", "Invalid Otp!")
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .matches("^[0-9]+$"),
  body("rememberToken", "Invalid Token!").trim().notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, otp, rememberToken } = req.body;
    const user = await getUserByEmail(email);
    checkUserAlreadyExist(user);
    const otpRow = await getOtpByEmail(email);
    checkOtpRowNotExist(otpRow);

    // check otp is same date and 5 errors
    const today = new Date().toLocaleDateString();
    const lastUpdated = new Date(otpRow!.updatedAt).toLocaleDateString();
    const isSameDate = today === lastUpdated;
    checkSameDateAndError(isSameDate, otpRow!.error);

    // check remember tokens are same (If not same might be attack and turn error 5)

    let otpData;
    if (otpRow!.rememberToken !== rememberToken) {
      otpData = {
        error: 5,
      };
      await updateOtp(otpRow!.id, otpData);
      return next(
        createError("This might be an Attack", 400, errorCode.attack)
      );
    }

    // check otp is expired or not
    const isExpired = moment().diff(otpRow!.updatedAt, "minute") > 2;
    if (isExpired) {
      return next(createError("OTP Expired!", 410, errorCode.otpExpired));
    }

    // If not match check same date
    const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp);
    if (!isMatchOtp) {
      // If same Date increase error plus 1
      if (isSameDate) {
        otpData = {
          error: {
            increment: 1,
          },
        };
      } else {
        // If not same Date turn error to 1
        otpData = {
          error: 1,
        };
      }
      // Update otp and Return error for wrong otp
      await updateOtp(otpRow!.id, otpData);
      return next(createError("Otp is incorrect!", 400, errorCode.invalid));
    }

    // If match generate verified Token and let move to confirm the password
    const verifiedToken = generateToken();
    otpData = {
      verifiedToken,
      error: 0,
      count: 1,
    };
    const result = await updateOtp(otpRow!.id, otpData);

    res.status(200).json({
      message: "Successfully verified Otp!",
      verifiedToken,
      email: result.email,
    });
  },
];

export const confirmPassword = [
  body("email", "Invalid Email Address!").trim().notEmpty().isEmail(),
  body("name", "Invalid Name!").trim().notEmpty().isLength({ max: 50 }),
  body("verifiedToken", "Invalid Token!").trim().notEmpty().escape(),
  body("password", "Invalid password!")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 15 }),
  body("confirmPassword", "Invalid password!")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 15 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, name, verifiedToken, password, confirmPassword } = req.body;

    // check 2 passwords are same
    if (password !== confirmPassword) {
      return next(
        createError("Password is not match!", 400, errorCode.invalid)
      );
    }

    // check user already exist
    const user = await getUserByEmail(email);
    checkUserAlreadyExist(user);

    // check otp exist
    const otpRow = await getOtpByEmail(email);
    checkOtpRowNotExist(otpRow);

    // if the error in otpRow is 5 this might be an attack
    if (otpRow!.error >= 5) {
      return next(
        createError("This request might be an attack!", 401, errorCode.attack)
      );
    }

    // check same verified token if not match this will be an attack make errors to 5
    if (otpRow!.verifiedToken !== verifiedToken) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpRow!.id, otpData);
      return next(
        createError("This might be an attack", 401, errorCode.attack)
      );
    }
    // check the otp is expired (if more than 15 min) the user need to request another otp
    const isExpired = moment().diff(otpRow!.updatedAt, "minute") > 15;
    if (isExpired) {
      return next(
        createError(
          "Your request is expired! Please Try again!",
          410,
          errorCode.otpExpired
        )
      );
    }

    // if pass hash the password and create new user without randtoken(which will replace later)
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const randToken = "Will Replace Later";

    const userData = {
      email,
      name,
      password: hashPassword,
      randToken,
      credits: { create: { balance: 0 } },
      transactionHistory: { create: {} },
    };

    const newUser = await createNewUser(userData);

    // generate access token (15min) and refresh token (30days)
    const accessTokenPayload = { id: newUser.id };
    const refreshTokenPayload = { id: newUser.id, email: newUser.email };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 15 * 60,
      }
    );
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d",
      }
    );

    const newUserData = {
      randToken: refreshToken,
    };

    // update randtoken in user data
    await updateUser(newUser!.id, newUserData);
    // save these tokens in http only cookies

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(200)
      .json({
        message: "Successfully Registered an account! Please Log In.",
        newUserId: newUser.id,
      });
  },
];

export const login = [
  body("email", "Invalid Email Address!").trim().notEmpty().isEmail(),
  body("password", "Invalid password!")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 15 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    checkUserNotExist(user);

    let userData;
    const today = new Date().toLocaleDateString();
    const lastUpdated = new Date(user!.updatedAt).toLocaleDateString();
    const isSameDate = today === lastUpdated;

    if (user?.status === "FREEZE") {
      if (isSameDate) {
        return next(
          createError("The user is Freezed!", 408, errorCode.accountFreeze)
        );
      }
    }

    // Check the passwords match
    const isPasswordsMatch = await bcrypt.compare(password, user!.password);
    // if not increase error count 1 if more than 10 errors, acount will be freezed for today
    if (!isPasswordsMatch) {
      // If not same date Let user login
      if (!isSameDate) {
        userData = {
          errorLoginCount: 1,
          status: "ACTIVE",
        };
      } else {
        if (user!.errorLoginCount >= 10) {
          userData = {
            status: "FREEZE",
          };
        } else {
          userData = {
            errorLoginCount: { increment: 1 },
          };
        }
      }
      await updateUser(user!.id, userData);
      return next(createError("Wrong Password!", 401, errorCode.invalid));
    }

    const accessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, email: user!.email };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 15 * 60,
      }
    );
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d",
      }
    );

    userData = {
      errorLoginCount: 0,
      randToken: refreshToken,
      status: "ACTIVE",
    };
    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(200)
      .json({
        message: "Successfully Login.",
        userId: user!.id,
      });
  },
];

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  // Check Refresh Token Exist Or Not
  checkRefreshTokenExist(refreshToken);

  let decoded;
  try {
    decoded = (await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    )) as {
      id: number;
      email: string;
    };
  } catch (error) {
    return next(
      createError(
        "Your are not an unauthenticated User",
        401,
        errorCode.unauthenticated
      )
    );
  }

  // if id is not a number throw error
  if (isNaN(decoded!.id)) {
    return next(
      createError(
        "Your are not an unauthenticated User",
        401,
        "Error_Unauthenticated"
      )
    );
  }

  // get user by id and update the randtoken
  const user = await getUserById(decoded!.id);
  checkUserNotExist(user);

  const randToken = generateToken();

  const userData = {
    randToken,
  };

  await updateUser(user!.id, userData);

  // Remove the cookies

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
  });

  res.status(200).json({
    message: "Successfully Logout! See Yoo!!",
  });
};
