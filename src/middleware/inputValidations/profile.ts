import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { errorHandler, throwErrorHandler } from "../../utils/errorHandlers";
import {
  API_CONSOLE,
  API_ERROR_RESPONSE,
  COLOR_CONSOLE,
  STATUS_CODE,
  ZOD_FIELDS,
} from "../../enums/enum";
import { decodeCaptchaToken } from "../../utils/generateToken";
import { PASSWORD_REGEX } from "../../utils/regex";
import { decryption } from "../../utils/crypto";

export const readInputValidation = async (
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
      userCode: z.array(z.number()).optional(),
      isSelf: z.boolean().optional(),
    }).parse(req.body);

    next();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateInputValidation = async (
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
      name: z.string().min(1, ZOD_FIELDS.NAME).optional(),
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
      userCode: z.number().optional(),
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

export const blockInputValidation = async (
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
      // isBlock: z.boolean({ invalid_type_error: ZOD_FIELDS.BOOLEAN }), // Not Required
      userCode: z.array(z.number()).optional(),
      captcha: z.string().length(6, ZOD_FIELDS.CAPTCHA),
      remarks: z.string(),
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

export const unBlockInputValidation = async (
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
      userCode: z.array(z.number()).optional(),
      captcha: z.string().length(6, ZOD_FIELDS.CAPTCHA),
      remarks: z.string().optional(),
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

export const deleteInputValidation = async (
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
      userCode: z.array(z.number()).optional(),
      captcha: z.string().length(6, ZOD_FIELDS.CAPTCHA),
      remarks: z.string().optional(),
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

export const changePasswordInputValidation = async (
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
    req.body.newPassword = decryption(req.body.newPassword);
    req.body.confirmPassword = decryption(req.body.confirmPassword);

    z.object({
      password: z
        .string()
        .min(8, ZOD_FIELDS.PASSWORD_MIN)
        .max(32, ZOD_FIELDS.PASSWORD_MAX)
        .regex(PASSWORD_REGEX),
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
      userCode: z.number().optional(),
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
