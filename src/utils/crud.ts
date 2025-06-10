import { Request, Response } from "express";
import db from "../models/model";
import { errorHandler } from "./errorHandlers";
import { logQuery } from "./logs";
import { logValueObject } from "./typeValidation";

// Function to create data in the desired table with transaction;
export const createFunction = async (
  req: Request,
  res: Response,
  tableName: string,
  postData: object,
) => {
  const transaction = await db.sequelize.transaction();
  const result = await db[tableName]
    .create(postData, {
      logging: (sql: string, value: logValueObject) => {
        logQuery(req, sql, value);
      },
      transaction,
    })
    .catch(async (error: Error) => errorHandler(res, error, transaction));

  await transaction.commit();
  return result;
};

// Function to found one data from the desire table;
export const findOneFunction = async (
  tableName: string,
  columnName: string,
  columnValue: string | boolean | number,
) => {
  // console.debug(
  //   "tableName: ",
  //   tableName,
  //   " columnName: ",
  //   columnName,
  //   " columnValue: ",
  //   columnValue
  // );

  try {
    const isExist = await db[tableName].findOne({
      order: [["id", "desc"]],
      where: {
        [columnName]: [columnValue],
        isDeleted: false,
      },
      raw: true,
    });

    const msg = `${columnName.charAt(0).toUpperCase() + columnName.slice(1)} Already Exists`;
    if (isExist) return { data: isExist, msg: msg };
  } catch (error) {
    console.debug("Error: ", error);
  }
};
