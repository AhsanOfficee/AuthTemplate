import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../../utils/errorHandlers";
import { findOneFunction } from "../../utils/crud";
import db from "../../models/model";
import { Op } from "sequelize";
import { compareHashing } from "../../utils/crypto";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  COLOR_CONSOLE,
  OTP_TYPE,
  STATUS,
  STATUS_CODE,
} from "../../enums/enum";
import { verifyOtp } from "../../utils/otpFunctions";

export const signUpApiValidation: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.API_VALIDATION_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const postData = req.body;

    // Check does the email already exits or not
    if (postData.email) {
      const whereStatement: object = { email: postData.email };
      const exits = await findOneFunction("users", whereStatement);
      if (exits) {
        return res.status(STATUS_CODE.CONFLICT).json({
          status: STATUS.FAILED,
          message: exits.msg,
        });
      }
    }

    // Check does the phone number already exits or not
    if (postData.phoneNo || postData.phoneCode) {
      const whereStatement: object = {
        phoneNo: postData.phoneNo,
        phoneCode: postData.phoneCode,
      };
      const exits = await findOneFunction("users", whereStatement);
      if (exits) {
        return res.status(STATUS_CODE.CONFLICT).json({
          status: STATUS.FAILED,
          message: exits.msg,
        });
      }
    }

    if (postData.password !== postData.confirmPassword) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.PASSWORD_MISMATCH,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const loginApiValidation: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.API_VALIDATION_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const postData = req.body;

    const exits = await db.users.findOne({
      order: [["id", "desc"]],
      where: {
        [Op.or]: [
          { email: postData.email || null },
          {
            [Op.and]: [
              { phoneNo: postData.phoneNo },
              { phoneCode: postData.phoneCode },
            ],
          },
        ],
        isDeleted: false,
      },
      raw: true,
    });

    if (!exits) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.USER_NOT_FOUND,
      });
    }

    const whereStatement: object = { userCode: exits.userCode };
    // Check if the password is correct or not
    const ifPassword = await findOneFunction("password", whereStatement);
    if (!ifPassword) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.INVALID_USER_OR_PASSWORD,
      });
    }

    const matchPassword = await compareHashing(
      ifPassword.data.saltValue,
      ifPassword.data.password,
      postData.password,
    );

    if (matchPassword === false) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.INVALID_USER_OR_PASSWORD,
      });
    }

    // Checking If User Is Already Logged IN
    const isAlreadyLoggedIn = await db.login_track.findOne({
      order: [["id", "desc"]],
      where: {
        userCode: exits.userCode,
        ipAddress: req.ip,
        loginTime: { [Op.lte]: new Date() },
        validLoginTime: { [Op.gte]: new Date() },
        logoutFlag: false,
        isDeleted: false,
      },
      raw: true,
    });

    if (isAlreadyLoggedIn !== undefined && isAlreadyLoggedIn !== null) {
      return res.status(STATUS_CODE.CONFLICT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.ALREADY_LOGGED_IN,
      });
    }

    postData.info = exits;
    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const otpFireApiValidation: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.API_VALIDATION_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const postData = req.body;

    const exits = await db.users.findOne({
      order: [["id", "desc"]],
      where: {
        email: postData.email,
        isDeleted: false,
      },
      raw: true,
    });

    if (!exits) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.USER_NOT_FOUND,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const validateOtpChangePasswordApiValidation: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.API_VALIDATION_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const postData = req.body;
    // email:
    // otp:
    // newPassword:
    // confirmPassword:

    const userExists =
      (await findOneFunction("users", { email: postData.email }))?.data ||
      undefined;
    if (!userExists) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.USER_NOT_FOUND,
      });
    }

    const isOtpVerified = await verifyOtp(
      res,
      userExists.userCode,
      postData.otp,
      OTP_TYPE.FORGET_PASSWORD,
    );
    if (!isOtpVerified) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.INVALID_OTP,
      });
    }

    if (postData.newPassword !== postData.confirmPassword) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.PASSWORD_MISMATCH,
      });
    }

    postData.userCode = userExists.userCode;
    postData.otpId = isOtpVerified.id;
    next();
  } catch (error) {
    errorHandler(res, error);
  }
};
