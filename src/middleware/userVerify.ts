import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/errorHandlers";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  COLOR_CONSOLE,
  STATUS,
  STATUS_CODE,
} from "../enums/enum";
import db from "../models/model";
import { decodeToken } from "../utils/generateToken";

export const isUserExists: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.IS_USER_EXISTS_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const info = decodeToken(req);

    const exits = await db.users.findOne({
      order: [["id", "desc"]],
      where: {
        userCode: info.userCode,
        isDeleted: false,
      },
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

export const isUserActive: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.IS_USER_ACTIVE_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const info = decodeToken(req);

    const exits = await db.users.findOne({
      order: [["id", "desc"]],
      where: {
        userCode: info.userCode,
        isActive: true,
        isDeleted: false,
      },
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

export const isUserBlock: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.IS_USER_BLOCK_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const info = decodeToken(req);

    const isBlock = await db.users.findOne({
      order: [["id", "desc"]],
      where: {
        userCode: info.userCode,
        isActive: false,
        isDeleted: false,
      },
    });

    if (isBlock) {
      return res.status(STATUS_CODE.BAD_INPUT).json({
        status: STATUS.FAILED,
        message: API_ERROR_RESPONSE.USER_bLOCK,
      });
    }

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const isUserDeleted: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug(
      COLOR_CONSOLE.DARK_GREEN,
      API_CONSOLE.IS_USER_DELETED_CALLED,
      API_CONSOLE.API_REQ_METHOD,
      req.method,
      API_CONSOLE.API_REQ_FULL_ENDPOINT,
      req.originalUrl,
    );
    const info = decodeToken(req);

    const isDeleted = await db.users.findOne({
      order: [["id", "desc"]],
      where: {
        userCode: info.userCode,
        isDeleted: true,
      },
    });

    if (isDeleted) {
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
