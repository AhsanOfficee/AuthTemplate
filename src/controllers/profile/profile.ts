import {
  API_CONSOLE,
  API_SUCCESS_RESPONSE,
  COLOR_CONSOLE,
  STATUS,
  STATUS_CODE,
} from "../../enums/enum";
import db from "../../models/model";
import { errorHandler } from "../../utils/errorHandlers";
import { Request, Response } from "express";
import { logValueObject } from "../../utils/typeValidation";
import { apiEndPoint, logQuery } from "../../utils/logs";
import { decodeToken } from "../../utils/generateToken";
import { Op } from "sequelize";
import { paginate } from "../../utils/pagination";
import { usersLogsCreation } from "../../utils/users_logs";
import { hashing } from "../../utils/crypto";

export const read = async (req: Request, res: Response) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.API_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );

  try {
    const postData = req.body;
    const baseQuery: any = {
      order: [["id", "desc"]],
      where: { isDeleted: false },
    };

    if (postData.userCode)
      baseQuery.where.userCode = { [Op.in]: postData.userCode };
    if (postData.isSelf) baseQuery.where.userCode = decodeToken(req).userCode;
    console.debug("baseQuery: ", baseQuery);

    const { result, metadata } = await paginate(req, baseQuery, db.users, true);
    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.RECORD_FETCHED_SUCCESSFULLY,
      data: result,
      metadata: metadata,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const update = async (req: Request, res: Response) => {
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;
    if (postData.userCode === undefined) postData.userCode = currentUserCode;

    const body = {
      name: postData.name,
      email: postData.email,
      phoneCode: postData.phoneCode,
      phoneNo: postData.phoneNo,
    };

    await db.users
      .update(body, {
        where: {
          userCode: postData.userCode,
          isDeleted: false,
        },
        logging: (sql: string, value: logValueObject) => {
          logQuery(req, sql, value, false);
        },
        transaction,
      })
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);

    // Storing Users Table Action Logs
    await usersLogsCreation(req, res, postData.userCode, postData.remarks);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const block = async (req: Request, res: Response) => {
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;
    if (postData.userCode.length === 0) postData.userCode = [currentUserCode];
    else
      postData.userCode = postData.userCode.filter(
        (value: number) => value !== parseInt(currentUserCode),
      );

    // Temporary Blocked
    await db.users
      .update(
        {
          isActive: false,
          isActiveActionDate: new Date(),
        },
        {
          where: {
            userCode: { [Op.in]: postData.userCode },
            isDeleted: false,
          },
          logging: (sql: string, value: logValueObject) => {
            logQuery(req, sql, value, false);
          },
          transaction,
        },
      )
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);

    // Storing Users Table Action Logs
    await usersLogsCreation(req, res, postData.userCode, postData.remarks);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.BLOCKED_SUCCESSFULLY,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const unblock = async (req: Request, res: Response) => {
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;
    if (postData.userCode.length === 0) postData.userCode = [currentUserCode];
    else
      postData.userCode = postData.userCode.filter(
        (value: number) => value !== parseInt(currentUserCode),
      );

    await db.users
      .update(
        {
          isActive: true,
          isActiveActionDate: new Date(),
        },
        {
          where: {
            userCode: { [Op.in]: postData.userCode },
            isDeleted: false,
          },
          logging: (sql: string, value: logValueObject) => {
            logQuery(req, sql, value, false);
          },
          transaction,
        },
      )
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);

    // Storing Users Table Action Logs
    await usersLogsCreation(req, res, postData.userCode, postData.remarks);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.ACTIVATED_SUCCESSFULLY,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const remove = async (req: Request, res: Response) => {
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;
    if (postData.userCode.length === 0) postData.userCode = [currentUserCode];
    else
      postData.userCode = postData.userCode.filter(
        (value: number) => value !== parseInt(currentUserCode),
      );

    await db.users
      .update(
        {
          isActive: false,
          isActiveActionDate: new Date(),
          isDeleted: true,
          isDeletedDate: new Date(),
        },
        {
          where: {
            userCode: { [Op.in]: postData.userCode },
            isDeleted: false,
          },
          logging: (sql: string, value: logValueObject) => {
            logQuery(req, sql, value, false);
          },
          transaction,
        },
      )
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);

    // Storing Users Table Action Logs
    await usersLogsCreation(req, res, postData.userCode, postData.remarks);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.ACCOUNT_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const changePassword = async (req: Request, res: Response) => {
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
    const currentUserCode = decodeToken(req).userCode;
    const postData = req.body;
    if (postData.userCode === undefined) postData.userCode = currentUserCode;

    // Password Hashing
    const hash = hashing(postData.password);
    postData.saltValue = hash.salt;
    postData.password = hash.saltedHash;

    // Soft Delete Old Password
    await db.password
      .update(
        {
          isDeleted: true,
          isDeletedDate: new Date(),
        },
        {
          where: {
            userCode: postData.userCode,
            isDeleted: false,
          },
          logging: (sql: string, value: logValueObject) => {
            logQuery(req, sql, value, false);
          },
          transaction,
        },
      )
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await db.password
      .create(postData, {
        logging: (sql: string, value: logValueObject) => {
          logQuery(req, sql, value, false, undefined, true);
        },
        transaction,
      })
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);

    res.status(STATUS_CODE.SUCCESS).json({
      status: STATUS.SUCCESS,
      msg: API_SUCCESS_RESPONSE.PASSWORD_UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
