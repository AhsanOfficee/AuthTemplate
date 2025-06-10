import { Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tokenObject } from "./typeValidation";
dotenv.config();

export const generateAccessToken = (
  userCode: string,
  name: string,
  ip: string | undefined,
) => {
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
  // @ts-ignore
  return jwt.sign(
    { userCode: userCode, name: name, ip: ip },
    `${process.env.refreshTokenSecret}`,
    { expiresIn: `${process.env.refreshTokenLife}` },
  );
};

export const decodeToken = (req: tokenObject) => {
  const encryptedData = req.headers.authorization.split(".")[1];
  const base64 = Buffer.from(encryptedData, "base64").toString();
  const decodedValue = JSON.parse(base64);
  return decodedValue;
};

export const decodeCaptchaToken = (req: tokenObject) => {
  const encryptedData = req.headers.captcha_authorization.split(".")[1];
  const base64 = Buffer.from(encryptedData, "base64").toString();
  const decodedValue = JSON.parse(base64);
  return decodedValue;
};

export const captchaToken = (
  captcha: string,
  secretKey: string | undefined,
  expireTime: string | undefined,
) => {
  // @ts-ignore
  return jwt.sign({ captcha: captcha }, `${secretKey}`, {
    expiresIn: `${expireTime}`,
  });
};
