import app from "express";
import * as auth from "../../controllers/auth/auth";
import * as inputValidation from "../../middleware/inputValidations/auth";
import * as apiValidation from "../../middleware/apiValidations/auth";
import {
  verifyAccessToken,
  verifyCaptchaToken,
  verifyRefreshToken,
} from "../../middleware/tokenVerify";
import { verifyLogoutStatus } from "../../middleware/logoutValitation";
const router = app.Router();

router.post(
  "/signUp",
  inputValidation.signUpInputValidation,
  apiValidation.signUpApiValidation,
  auth.signUpApi,
);

router.post(
  "/login",
  verifyCaptchaToken,
  inputValidation.loginInputValidation,
  apiValidation.loginApiValidation,
  auth.loginApi,
);

router.get(
  "/generate/access/token",
  verifyRefreshToken,
  auth.generateAccessTokenApi,
);

router.get("/logout", verifyAccessToken, verifyLogoutStatus, auth.logoutApi);

router.get("/generate/captcha/token", auth.generateCaptchaTokenApi);

export const authRouter = router;
