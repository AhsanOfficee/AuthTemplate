import { Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tokenObject } from "./typeValidation";
import { FUNCTION_CONSOLE } from "../enums/enum";
dotenv.config();

export const generateAccessToken = (
  userCode: string,
  name: string,
  ip: string | undefined,
) => {
  console.debug(FUNCTION_CONSOLE.GENERATE_ACCESS_TOKEN_FUNCTION_CALLED);

  // @ts-ignore
  return jwt.sign(
    { userCode: userCode, name: name, ip: ip },
    `${process.env.accessTokenSecret}`,
    { expiresIn: `${process.env.tokenLife}` },
  );
};

export const generateRefreshToken = (
  userCode: string,
  name: string,
  ip: string | undefined,
) => {
  console.debug(FUNCTION_CONSOLE.GENERATE_REFRESH_ACCESS_TOKEN_FUNCTION_CALLED);

  // @ts-ignore
  return jwt.sign(
    { userCode: userCode, name: name, ip: ip },
    `${process.env.refreshTokenSecret}`,
    { expiresIn: `${process.env.refreshTokenLife}` },
  );
};

export const decodeToken = (req: tokenObject) => {
  console.debug(FUNCTION_CONSOLE.DECODE_TOKEN_FUNCTION_CALLED);

  const encryptedData = req.headers.authorization.split(".")[1];
  const base64 = Buffer.from(encryptedData, "base64").toString();
  const decodedValue = JSON.parse(base64);
  return decodedValue;
};

export const decodeCaptchaToken = (req: tokenObject) => {
  console.debug(FUNCTION_CONSOLE.DECODE_CAPTCHA_TOKEN_FUNCTION_CALLED);

  const encryptedData = req.headers.captcha_authorization.split(".")[1];
  const base64 = Buffer.from(encryptedData, "base64").toString();
  const decodedValue = JSON.parse(base64);
  return decodedValue;
};

export const generateCaptchaToken = (
  captcha: string,
  secretKey: string | undefined,
  expireTime: string | undefined,
) => {
  console.debug(FUNCTION_CONSOLE.GENERATE_CAPTCHA_TOKEN_FUNCTION_CALLED);

  // @ts-ignore
  return jwt.sign({ captcha: captcha }, `${secretKey}`, {
    expiresIn: `${expireTime}`,
  });
};
