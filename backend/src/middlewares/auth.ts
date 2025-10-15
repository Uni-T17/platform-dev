import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { createError, errorCode } from "../utils/error";
import { getUserById, updateUser } from "../services/authServices";
import { checkUserNotExist } from "../utils/check";

const isProduction = process.env.NODE_ENV === "production";

interface CustomRequest extends Request {
  userId?: number;
}

export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  const generateAccessToken = async () => {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        email: string;
      };
    } catch (error) {
      return next(
        createError(
          "You are not an authenticated user!!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    // If id is not a number
    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an authenticated user!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const user = await getUserById(decoded.id);
    checkUserNotExist(user);

    // check email and token email / tokens and user Token are same
    if (decoded.email !== user!.email || user!.randToken !== refreshToken) {
      return next(
        createError(
          "You are not an authenticated user!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const accessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, email: user!.email };

    const newAccessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 15 * 60 }
    );

    const newRefreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "30d" }
    );
    const userData = {
      randToken: newRefreshToken,
    };

    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

    req.userId = user!.id;
    return next();
  };

  if (!refreshToken) {
    return next(
      createError(
        "You are not an authenticated user!!",
        401,
        errorCode.unauthenticated
      )
    );
  }
  if (!accessToken) {
    await generateAccessToken();
    return;
  }

  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
      id: number;
    };
    // if id is not number
    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an authenticated user!!",
          401,
          errorCode.unauthenticated
        )
      );
    }
    req.userId = decoded!.id;
    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      await generateAccessToken();
      return;
    } else {
      return next(
        createError("Access Token is Invalid", 401, errorCode.attack)
      );
    }
  }
};
