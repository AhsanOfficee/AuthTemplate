import svgCaptcha from "svg-captcha";
import { captchaToken } from "./generateToken";
import dotenv from "dotenv";
dotenv.config();

export const textCaptcha = () => {
  const captcha = svgCaptcha.create({
    size: 6, // size of random string
    ignoreChars: "0OoI1i", // filter out some characters like 0o1i
    noise: 2, // number of noise lines
    color: true, // characters will have distinct colors instead of grey, true if background option is set
    background: "#cc9966", // background color of the svg image
  });

  return {
    text: captcha.text,
    token: captchaToken(
      captcha.text,
      process.env.captchaTokenSecret,
      process.env.captchaTokenLife,
    ),
  };
};
