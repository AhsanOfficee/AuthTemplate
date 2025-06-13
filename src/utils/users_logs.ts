import { Request, Response } from "express";
import db from "../models/model";
import { apiEndPoint } from "./logs";
import { Op } from "sequelize";
import { errorHandler } from "./errorHandlers";
import { FUNCTION_CONSOLE } from "../enums/enum";

export const usersLogsCreation = async (
  req: Request,
  res: Response,
  userCode: Array<number | string> | number | string,
  remarks?: string,
) => {
  console.debug(FUNCTION_CONSOLE.SAVE_USER_LOGS_FUNCTION_CALLED);

  try {
    const transaction = await db.sequelize.transaction();

    if (typeof userCode != "object") userCode = [userCode];
    const typeOfApiAction = apiEndPoint(req); // || (req.originalUrl).split('/')[(req.originalUrl).split('/').length -1];

    const detailsCopy = await db.users.findAll({
      order: [["id", "desc"]],
      where: { userCode: { [Op.in]: userCode } },
      raw: true,
    });

    detailsCopy.forEach((element: any) => {
      element.typeOfEndPoint = req.originalUrl;
      element.typeOfApiAction = typeOfApiAction;
      element.remarks = remarks;
      delete element.id;
    });

    await db.users_logs
      .bulkCreate(detailsCopy, { transaction })
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
  } catch (error) {
    errorHandler(res, error);
  }
};
