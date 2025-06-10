import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandlers";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  COLOR_CONSOLE,
  STATUS,
  STATUS_CODE,
} from "../enums/enum";
dotenv.config();
const bearer = process.env.Bearer;

export const verifyAccessToken: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.VERIFY_ACCESS_TOKEN_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    let AccessFlag = false;
    const authentication = req.headers.authorization;

    if (!authentication) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.NO_TOKEN_FOUND,
      });
    }

    // Check If Bearer or not
    if (bearer != authentication.split(" ")[0]) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
      });
    }

    jwt.verify(
      authentication.split(" ")[1],
      `${process.env.accessTokenSecret}`,
      (err) => {
        if (!err) AccessFlag = true;
      },
    );

    if (AccessFlag === false) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const verifyRefreshToken: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.VERIFY_REFRESH_ACCESS_TOKEN_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    let AccessFlag = false;
    const authentication = req.headers.authorization;

    if (!authentication) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.NO_TOKEN_FOUND,
      });
    }

    // Check If Bearer or not
    if (bearer != authentication.split(" ")[0]) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.INVALID_REFRESH_TOKEN,
      });
    }

    jwt.verify(
      authentication.split(" ")[1],
      `${process.env.refreshTokenSecret}`,
      (err) => {
        if (!err) AccessFlag = true;
      },
    );

    if (AccessFlag === false) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.INVALID_REFRESH_TOKEN,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const verifyCaptchaToken: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.VERIFY_CAPTCHA_ACCESS_TOKEN_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    let AccessFlag = false;
    const authentication: string | undefined = req.headers
      .captcha_authorization as string | undefined;

    if (!authentication) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.NO_TOKEN_FOUND,
      });
    }

    // Check If Bearer or not
    if (bearer != authentication.split(" ")[0]) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.INVALID_CAPTCHA_TOKEN,
      });
    }

    jwt.verify(
      authentication.split(" ")[1],
      `${process.env.captchaTokenSecret}`,
      (err) => {
        if (!err) AccessFlag = true;
      },
    );

    if (AccessFlag === false) {
      return res.status(STATUS_CODE.UN_AUTHORIZED).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.INVALID_CAPTCHA_TOKEN,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};
