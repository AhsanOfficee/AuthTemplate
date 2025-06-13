import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { errorHandler, throwErrorHandler } from "../../utils/errorHandlers";
import { decryption } from "../../utils/crypto";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  COLOR_CONSOLE,
  STATUS_CODE,
  ZOD_FIELDS,
} from "../../enums/enum";
import { PASSWORD_REGEX } from "../../utils/regex";
import { decodeCaptchaToken } from "../../utils/generateToken";

// Define the schema using Zod
export const signUpInputValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.INPUT_VALIDATION_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );
  console.debug("Req Body: ", req.body);

  try {
    req.body.password = decryption(req.body.password);
    req.body.confirmPassword = decryption(req.body.confirmPassword);

    z.object({
      name: z.string().min(1, ZOD_FIELDS.NAME),
      email: z.string().email(ZOD_FIELDS.EMAIL),
      phoneCode: z
        .string()
        .min(2, ZOD_FIELDS.PHONE_CODE_MIN)
        .max(5, ZOD_FIELDS.PHONE_CODE_MAX)
        .optional(),
      phoneNo: z
        .number()
        .int()
        .min(1000000000, ZOD_FIELDS.PHONE_NO)
        .max(9999999999, ZOD_FIELDS.PHONE_NO)
        .optional(),
      password: z
        .string()
        .min(8, ZOD_FIELDS.PASSWORD_MIN)
        .max(32, ZOD_FIELDS.PASSWORD_MAX)
        .regex(PASSWORD_REGEX),
      confirmPassword: z
        .string()
        .min(8, ZOD_FIELDS.PASSWORD_MIN)
        .max(32, ZOD_FIELDS.PASSWORD_MAX)
        .regex(PASSWORD_REGEX),
    })
      .refine(
        (data) => {
          const phoneNoPresent = data.phoneNo !== undefined;
          const phoneCodePresent = data.phoneCode !== undefined;

          return phoneNoPresent === phoneCodePresent;
        },
        {
          message: ZOD_FIELDS.PHONE_NO_AND_PHONE_CODE,
          path: ["phoneNo"], // or ["phoneCode"], depends where you want the error
        },
      )
      .parse(req.body);

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const loginInputValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.INPUT_VALIDATION_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );
  console.debug("Req Body: ", req.body);

  try {
    req.body.password = decryption(req.body.password);

    z.object({
      email: z.string().email(ZOD_FIELDS.EMAIL).optional(),
      phoneCode: z
        .string()
        .min(2, ZOD_FIELDS.PHONE_CODE_MIN)
        .max(5, ZOD_FIELDS.PHONE_CODE_MAX)
        .optional(),
      phoneNo: z
        .number()
        .int()
        .min(1000000000, ZOD_FIELDS.PHONE_NO)
        .max(9999999999, ZOD_FIELDS.PHONE_NO)
        .optional(),
      password: z
        .string()
        .min(8, ZOD_FIELDS.PASSWORD_MIN)
        .max(32, ZOD_FIELDS.PASSWORD_MAX)
        .regex(PASSWORD_REGEX),
      captcha: z.string().length(6, ZOD_FIELDS.CAPTCHA),
    })
      .refine(
        (data) => {
          const phoneNoPresent = data.phoneNo !== undefined;
          const phoneCodePresent = data.phoneCode !== undefined;

          return phoneNoPresent === phoneCodePresent;
        },
        {
          message: ZOD_FIELDS.PHONE_NO_AND_PHONE_CODE,
          path: ["phoneNo"], // or ["phoneCode"], depends where you want the error
        },
      )
      .parse(req.body);

    const validateCaptcha = await decodeCaptchaToken(req);

    if (validateCaptcha.captcha !== req.body.captcha)
      throwErrorHandler(
        res,
        STATUS_CODE.BAD_INPUT,
        API_ERROR_RESPONSE.INVALID_CAPTCHA,
      );

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const otpFireInputValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.INPUT_VALIDATION_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );
  console.debug("Req Body: ", req.body);

  try {
    z.object({
      email: z.string().email(ZOD_FIELDS.EMAIL),
      captcha: z.string().length(6, ZOD_FIELDS.CAPTCHA),
    }).parse(req.body);

    const validateCaptcha = await decodeCaptchaToken(req);

    if (validateCaptcha.captcha !== req.body.captcha)
      throwErrorHandler(
        res,
        STATUS_CODE.BAD_INPUT,
        API_ERROR_RESPONSE.INVALID_CAPTCHA,
      );

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const validateOtpChangePasswordInputValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.debug(
    COLOR_CONSOLE.DARK_GREEN,
    API_CONSOLE.INPUT_VALIDATION_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );
  console.debug("Req Body: ", req.body);

  try {
    req.body.newPassword = decryption(req.body.newPassword);
    req.body.confirmPassword = decryption(req.body.confirmPassword);

    z.object({
      email: z.string().email(ZOD_FIELDS.EMAIL),
      otp: z
        .number()
        .int()
        .min(100000, ZOD_FIELDS.OTP)
        .max(999999, ZOD_FIELDS.OTP),
      captcha: z.string().length(6, ZOD_FIELDS.CAPTCHA),
      newPassword: z
        .string()
        .min(8, ZOD_FIELDS.PASSWORD_MIN)
        .max(32, ZOD_FIELDS.PASSWORD_MAX)
        .regex(PASSWORD_REGEX),
      confirmPassword: z
        .string()
        .min(8, ZOD_FIELDS.PASSWORD_MIN)
        .max(32, ZOD_FIELDS.PASSWORD_MAX)
        .regex(PASSWORD_REGEX),
    }).parse(req.body);

    const validateCaptcha = await decodeCaptchaToken(req);

    if (validateCaptcha.captcha !== req.body.captcha)
      throwErrorHandler(
        res,
        STATUS_CODE.BAD_INPUT,
        API_ERROR_RESPONSE.INVALID_CAPTCHA,
      );

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};
