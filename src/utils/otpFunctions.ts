import { FUNCTION_CONSOLE, OTP_TYPE, STATUS } from "../enums/enum";
import db from "../models/model";
import { errorHandler } from "./errorHandlers";
import { logQuery } from "./logs";
import { logValueObject } from "./typeValidation";
import { Request, Response } from "express";
import moment from "moment";

export const generateOtp = async () => {
  console.debug(FUNCTION_CONSOLE.GENERATE_OTP_FUNCTION_CALLED);

  // Soft Delete Expired Otp
  await db.otp
    .update(
      { isDeleted: true, isDeletedDate: new Date(), status: STATUS.EXPIRED },
      {
        where: {
          status: { [db.Sequelize.Op.ne]: STATUS.VERIFIED }, // create a status type
          otpExpireTime: {
            [db.Sequelize.Op.lte]: new Date(),
          },
        },
      },
    )
    .catch(async (error: Error) => console.log("error: ", error));

  // Generate a random 6-digit OTP code
  // The OTP code will be a number between 100000 and 999999
  // This ensures that the OTP is always 6 digits long
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  return otpCode;
};

export const isOtpValid = async (otpCode: number, otpType: OTP_TYPE) => {
  console.debug(FUNCTION_CONSOLE.IS_VALID_OTP_FUNCTION_CALLED);

  // Check if the OTP code exists in the database and is not expired
  // The OTP code is valid if it exists and the expiration time is in the future
  const isExists = await db.otp.findOne({
    where: {
      otpCode: otpCode,
      otpExpireTime: {
        [db.Sequelize.Op.gte]: new Date(),
      },
      otpType: otpType,
      isDeleted: false,
    },
    raw: true,
  });

  if (isExists) return false;
  return true;
};

export const generateUniqueOtp = async (otpType: OTP_TYPE): Promise<number> => {
  console.debug(FUNCTION_CONSOLE.GENERATE_UNIQUE_OTP_FUNCTION_CALLED);

  const otp = await generateOtp();
  const isValid = await isOtpValid(otp, otpType);

  if (isValid) return otp;
  else return await generateUniqueOtp(otpType);
};

export const saveOtpToDatabase = async (
  req: Request,
  res: Response,
  userCode: number,
  otp: number,
  otpType: OTP_TYPE,
  otpExpireTime: number | undefined,
) => {
  console.debug(FUNCTION_CONSOLE.SAVE_OTP_FUNCTION_CALLED);

  try {
    const transaction = await db.sequelize.transaction();
    // Save the OTP code to the database with a 5-minute expiration time
    await db.otp
      .create(
        {
          userCode: userCode,
          otpCode: otp,
          otpType: otpType,
          otpExpireTime: moment(new Date())
            .add(otpExpireTime, "minutes")
            .format("YYYY-MM-DD HH:mm:ss"),
          status: STATUS.PENDING,
        },
        {
          logging: (sql: string, value: logValueObject) => {
            logQuery(req, sql, value, false, userCode);
          },
          transaction,
        },
      )
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);
  } catch (error) {
    errorHandler(res, error);
  }
};

export const verifyOtp = async (
  res: Response,
  userCode: number,
  otp: number,
  otpType: OTP_TYPE,
) => {
  console.debug(FUNCTION_CONSOLE.VERIFY_OTP_FUNCTION_CALLED);

  try {
    const isVerified = await db.otp.findOne({
      order: [["id", "desc"]],
      where: {
        userCode: userCode,
        otpCode: otp,
        otpType: otpType,
        otpExpireTime: { [db.Sequelize.Op.gte]: new Date() },
        isDeleted: false,
        isDeletedDate: null,
      },
    });

    if (!isVerified) return false;
    return isVerified;
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateOtpStatus = async (
  req: Request,
  res: Response,
  id: number,
  userCode: number,
) => {
  console.debug(FUNCTION_CONSOLE.UPDATE_OTP_FUNCTION_CALLED);

  try {
    const transaction = await db.sequelize.transaction();

    await db.otp
      .update(
        { status: STATUS.VERIFIED },
        {
          where: { id: id },
          logging: (sql: string, value: logValueObject) => {
            logQuery(req, sql, value, false, userCode);
          },
          transaction,
        },
      )
      .catch(async (error: Error) => errorHandler(res, error, transaction));

    await transaction.commit();
    logQuery(req, null, null, true);
  } catch (error) {
    errorHandler(res, error);
  }
};
