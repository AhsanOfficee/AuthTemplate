import e, { NextFunction, Request, Response } from "express";
import { errorHandler } from "../../utils/errorHandlers";
import db from "../../models/model";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  COLOR_CONSOLE,
  STATUS,
  STATUS_CODE,
} from "../../enums/enum";
import { decodeToken } from "../../utils/generateToken";
import { Op } from "sequelize";
import { findOneFunction } from "../../utils/crud";
import { compareHashing } from "../../utils/crypto";

export const updateApiValidation: (
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;

    if (postData.userCode === undefined) postData.userCode = currentUserCode;

    const exits = await db.users.findOne({
      order: [["id", "desc"]],
      where: { userCode: postData.userCode, isDeleted: false },
      raw: true,
    });

    if (!exits) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.USER_NOT_FOUND,
      });
    }

    // Check does the email already exits or not
    if (postData.email) {
      const dtls = await db.users.findOne({
        where: {
          email: postData.email,
          userCode: { [Op.ne]: postData.userCode },
          isDeleted: false,
        },
        raw: true,
      });

      if (dtls) exits.msg = API_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS;
    }

    // Check does the phoneNo already exits or not
    if (postData.phoneNo || postData.phoneCode) {
      const dtls = await db.users.findOne({
        where: {
          phoneCode: postData.phoneCode,
          phoneNo: postData.phoneNo,
          userCode: { [Op.ne]: postData.userCode },
          isDeleted: false,
        },
        raw: true,
      });

      if (dtls) exits.msg = API_ERROR_RESPONSE.PHONE_NO_ALREADY_EXISTS;
    }

    if (exits.msg !== undefined) {
      return res.status(STATUS_CODE.CONFLICT).json({
        status: STATUS.FAILED,
        message: exits.msg,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const blockApiValidation: (
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
    if (postData.userCode === undefined) postData.userCode = [];

    const exits = await db.users.findAll({
      order: [["id", "desc"]],
      where: { userCode: { [Op.in]: postData.userCode }, isDeleted: false },
      raw: true,
    });

    if (exits.length !== postData.userCode.length) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.RECORD_NOT_FOUND,
      });
    }

    const allReadyBlockedUser: Array<number> = [];
    exits.forEach((element: { isActive: boolean; userCode: number }) => {
      if (element.isActive === false)
        allReadyBlockedUser.push(element.userCode);
    });

    if (allReadyBlockedUser.length > 0) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: `${allReadyBlockedUser} ${API_ERROR_RESPONSE.USER_bLOCK}`,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const unBlockApiValidation: (
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;

    if (postData.userCode !== undefined) {
      const whereStatement = {userCode: currentUserCode};
      const exits = await findOneFunction("users", whereStatement);
      if (!exits?.data.isActive) {
        return res.status(STATUS_CODE.BAD_INPUT).json({
          status: STATUS.FAILED,
          message: API_ERROR_RESPONSE.USER_bLOCK,
        });
      }

      postData.userCode = postData.userCode.filter(
        (value: number) => value !== parseInt(currentUserCode),
      );
    } else postData.userCode = [currentUserCode];

    const exits = await db.users.findAll({
      order: [["id", "desc"]],
      where: { userCode: { [Op.in]: postData.userCode }, isDeleted: false },
      raw: true,
    });

    if (exits.length !== postData.userCode.length) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.RECORD_NOT_FOUND,
      });
    }

    const allReadyBlockedUser: Array<number> = [];
    exits.forEach((element: { isActive: boolean; userCode: number }) => {
      if (element.isActive === true) allReadyBlockedUser.push(element.userCode);
    });

    if (allReadyBlockedUser.length > 0) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: `${allReadyBlockedUser} ${API_ERROR_RESPONSE.USER_IS_ALREADY_ACTIVE}`,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteApiValidation: (
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;
    if (postData.userCode === undefined) postData.userCode = [currentUserCode];
    else
      postData.userCode = postData.userCode.filter(
        (value: number) => value !== parseInt(currentUserCode),
      );

    const exits = await db.users.findAll({
      order: [["id", "desc"]],
      where: { userCode: { [Op.in]: postData.userCode } },
      raw: true,
    });

    if (exits.length !== postData.userCode.length) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.RECORD_NOT_FOUND,
      });
    }

    const allReadyBlockedUser: Array<number> = [];
    exits.forEach((element: { isDeleted: boolean; userCode: number }) => {
      if (element.isDeleted === true)
        allReadyBlockedUser.push(element.userCode);
    });

    if (allReadyBlockedUser.length > 0) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: `${allReadyBlockedUser} ${API_ERROR_RESPONSE.ACCOUNT_ALREADY_DELETED}`,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const changePasswordApiValidation: (
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;

    if (postData.userCode === undefined) postData.userCode = currentUserCode;

    const exits = await db.users.findOne({
      order: [["id", "desc"]],
      where: { userCode: postData.userCode, isDeleted: false },
      raw: true,
    });

    if (!exits) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.USER_NOT_FOUND,
      });
    }

    const whereStatement = {userCode: postData.userCode};
    // Check if the password is correct or not
    const ifPassword = await findOneFunction(
      "password",
      whereStatement,
    );
    if (!ifPassword) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.INVALID_USER_OR_PASSWORD,
      });
    }

    const matchPassword = compareHashing(
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

    if (postData.newPassword !== postData.confirmPassword) {
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
