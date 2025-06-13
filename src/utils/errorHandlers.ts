import { Request, Response } from "express";
import { z } from "zod";
import { CapitalizeFirstCharOfEveryWord } from "./otherFunctions";
import {
  COLOR_CONSOLE,
  FUNCTION_CONSOLE,
  STATUS,
  STATUS_CODE,
} from "../enums/enum";
import { Transaction } from "sequelize";

export const errorHandler = async (
  res: Response,
  error: Error | any,
  transaction?: Transaction,
) => {
  console.debug(FUNCTION_CONSOLE.ERROR_HANDLER_CALLED);

  if (transaction) await transaction.rollback();

  if (error instanceof z.ZodError) {
    // Handle Zod validation
    const returnError: any = [];
    error.errors.forEach((err: any) => {
      console.debug("error: ", err);
      const key = err.path[err.path.length - 1];
      returnError.push({ [key]: err.message });
    }); // Extract error messages
    return res.status(STATUS_CODE.BAD_INPUT).json({
      status: STATUS.FAILED,
      error: returnError,
    });
  }

  let errorMsg = String(error);
  if (errorMsg.split(":")[0] === "SequelizeDatabaseError")
    errorMsg = String(error).split(":")[1];

  // Handle other errors
  console.debug("error: ", error);
  return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    status: STATUS.FAILED,
    msg: CapitalizeFirstCharOfEveryWord(errorMsg),
  });
};

export const throwErrorHandler = async (
  res: Response,
  statusCode: number,
  error: Error | any,
) => {
  console.debug(FUNCTION_CONSOLE.THROW_ERROR_HANDLER_CALLED);

  return res.status(statusCode).json({
    status: STATUS.FAILED,
    msg: error,
  });
};
