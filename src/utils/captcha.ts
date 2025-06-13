import svgCaptcha from "svg-captcha";
import { generateCaptchaToken } from "./generateToken";
import dotenv from "dotenv";
import { FUNCTION_CONSOLE } from "../enums/enum";
dotenv.config();

export const textCaptcha = () => {
  console.debug(FUNCTION_CONSOLE.GENERATE_CAPTCHA_FUNCTION_CALLED);

  const captcha = svgCaptcha.create({
    size: 6, // size of random string
    ignoreChars: "0OoI1i", // filter out some characters like 0o1i
    noise: 2, // number of noise lines
    color: true, // characters will have distinct colors instead of grey, true if background option is set
    background: "#cc9966", // background color of the svg image
  });

  return {
    text: captcha.text,
    token: generateCaptchaToken(
      captcha.text,
      process.env.captchaTokenSecret,
      process.env.captchaTokenLife,
    ),
  };
};
