import { Request, Response } from "express";
import { errorHandler, throwErrorHandler } from "../../utils/errorHandlers";
import db from "../../models/model";
import { hashing } from "../../utils/crypto";
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import { generateUserCode } from "../../utils/generateUserNo";
import { logQuery } from "../../utils/logs";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  API_SUCCESS_RESPONSE,
  COLOR_CONSOLE,
  STATUS,
  STATUS_CODE,
} from "../../enums/enum";
import { logValueObject } from "../../utils/typeValidation";
import { textCaptcha } from "../../utils/captcha";
import moment from "moment";
import { usersLogsCreation } from "../../utils/users_logs";

export const signUpApi = async (req: Request, res: Response) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.API_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const transaction = await db.sequelize.transaction();
    const postData = req.body;

    postData.userCode = await generateUserCode();

    // Password Hashing
    const hash = await hashing(postData.password);
    postData.saltValue = hash.salt;
    postData.password = hash.saltedHash;
    postData.isActiveActionDate = new Date();

    await db.users
      .create(postData, {
        logging: (sql: string, value: logValueObject) => {
          logQuery(req, sql, value, false, postData.userCode);
        },
        transaction,
      })
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await db.password
      .create(postData, {
        logging: (sql: string, value: logValueObject) => {
          logQuery(req, sql, value, false, postData.userCode, true);
        },
        transaction,
      })
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true); // To verify that the transaction is completed successfully

    // Storing Users Table Action Logs
    await usersLogsCreation(req, res, postData.userCode);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.SIGN_UP_MESSAGE,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const loginApi = async (req: Request, res: Response) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.API_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const transaction = await db.sequelize.transaction();
    const postData = req.body;
    postData.userCode = postData.info.userCode;

    postData.ipAddress = req.ip;
    postData.loginTime = new Date();
    // @ts-ignore
    postData.validLoginTime = moment(postData.loginTime).add(
      process.env.validTime,
      process.env.ValidForm,
    );

    await db.login_track
      .create(postData, {
        logging: (sql: string, value: logValueObject) => {
          logQuery(req, sql, value, false, postData.info.userCode);
        },
        transaction,
      })
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);

    // Deleting Unnecessary Data
    delete postData.info.id
    delete postData.info.isActiveActionDate;
    delete postData.info.isDeleted;
    delete postData.info.isDeletedDate;
    delete postData.info.createdAt;
    delete postData.info.updatedAt;

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.LOGIN_MESSAGE,
      userDetails: postData.info,
      accessToken: generateAccessToken(
        postData.info.userCode,
        postData.info.name,
        req.ip,
      ),
      refreshToken: generateRefreshToken(
        postData.info.userCode,
        postData.info.name,
        req.ip,
      ),
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const generateAccessTokenApi = async (req: Request, res: Response) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.API_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const info = decodeToken(req);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.TOKEN_GENERATED_SUCCESSFULLY,
      accessToken: generateAccessToken(info.userCode, info.name, info.ip),
      refreshToken: generateRefreshToken(info.userCode, info.name, info.ip),
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const generateCaptchaTokenApi = async (req: Request, res: Response) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.API_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const captcha = textCaptcha();

    if (!captcha)
      throwErrorHandler(
        res,
        STATUS_CODE.BAD_INPUT,
        API_ERROR_RESPONSE.INVALID_CAPTCHA,
      );

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.CAPTCHA_TOKEN_GENERATED_SUCCESSFULLY,
      captchaText: captcha.text,
      captchaToken: captcha.token,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const logoutApi = async (req: Request, res: Response) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.API_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const transaction = await db.sequelize.transaction();
    const postData = req.body;
    await db.login_track.update(
      {
        logoutFlag: true,
        logoutTime: new Date(),
      },
      {
        where: { id: postData.userLoginDetails.id, isDeleted: false },
        logging: (sql: string, value: logValueObject) => {
          logQuery(req, sql, value, false, postData.userLoginDetails.userCode);
        },
        transaction,
      },
    );

    await transaction.commit();
    logQuery(req, null, null, true);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.LOGOUT_MESSAGE,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
