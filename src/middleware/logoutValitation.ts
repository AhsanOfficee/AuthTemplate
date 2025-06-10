import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandlers";
import dotenv from "dotenv";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  COLOR_CONSOLE,
  STATUS,
  STATUS_CODE,
} from "../enums/enum";
import { decodeToken } from "../utils/generateToken";
import db from "../models/model";
import { Op } from "sequelize";
import { logValueObject } from "../utils/typeValidation";
import { logQuery } from "../utils/logs";
import moment from "moment";
dotenv.config();

export const verifyLogoutStatus: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.VERIFY_LOGOUT_STATUS_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const userDetails = await decodeToken(req);

    const loginTrack = await db.login_track.findAll({
      where: { isDeleted: false },
      raw: true,
    });

    if (
      loginTrack === undefined ||
      loginTrack === null ||
      loginTrack.length === 0
    ) {
      return res.status(STATUS_CODE.LOGIN_TIMEOUT).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.SESSION_EXPIRED,
      });
    }

    // Checking If User Is Logged IN
    const ifLoggedIn = await db.login_track.findOne({
      order: [["id", "desc"]],
      where: {
        userCode: userDetails.userCode,
        ipAddress: req.ip,
        loginTime: { [Op.lte]: new Date() },
        validLoginTime: { [Op.gte]: new Date() },
        logoutFlag: false,
        isDeleted: false,
      },
      raw: true,
    });

    if (ifLoggedIn === undefined || ifLoggedIn === null) {
      return res.status(STATUS_CODE.LOGIN_TIMEOUT).json({
        status: STATUS.FAILED,
        msg: API_ERROR_RESPONSE.SESSION_EXPIRED,
      });
    }

    if (req.body === undefined || req.body === null) req.body = {};
    req.body.userLoginDetails = ifLoggedIn;

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateLoginStatus: (
  req: Request,
  res: Response,
  next: NextFunction,
) => any = async (req: Request, res: Response, next: NextFunction) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.UPDATE_LOGIN_STATUS_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const transaction = await db.sequelize.transaction();
    const ifLoggedIn = req.body.userLoginDetails;

    // Soft Delete The Current Login Track
    await db.login_track
      .update(
        {
          isDeleted: true,
          isDeletedDate: new Date(),
        },
        {
          where: { id: ifLoggedIn.id },
          logging: (sql: string, value: logValueObject) => {
            logQuery(
              req,
              sql,
              value,
              false,
              ifLoggedIn.userCode,
              undefined,
              true,
            );
          },
          transaction,
        },
      )
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    // Create A New Login Track With Updated ValidLoginTime
    delete ifLoggedIn.id;
    // @ts-ignore
    ifLoggedIn.validLoginTime = moment(new Date()).add(
      process.env.validTime,
      process.env.ValidForm,
    );

    await db.login_track
      .create(ifLoggedIn, {
        logging: (sql: string, value: logValueObject) => {
          logQuery(
            req,
            sql,
            value,
            false,
            ifLoggedIn.userCode,
            undefined,
            true,
          );
        },
        transaction,
      })
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};
