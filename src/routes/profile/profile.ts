import app from "express";
import {
  updateLoginStatus,
  verifyLogoutStatus,
} from "../../middleware/logoutValitation";
import {
  verifyAccessToken,
  verifyCaptchaToken,
} from "../../middleware/tokenVerify";
import * as profile from "../../controllers/profile/profile";
import { isUserExists, isUserBlock } from "../../middleware/userVerify";
import * as inputValidation from "../../middleware/inputValidations/profile";
import * as apiValidation from "../../middleware/apiValidations/profile";
const router = app.Router();

// If User Code Is Provided Then It Will fetch All Selected User Other Wise It Will Fetch Only Current User Data
router.get(
  "/read",
  verifyAccessToken,
  isUserExists,
  verifyLogoutStatus,
  updateLoginStatus,
  inputValidation.readInputValidation,
  profile.read,
);

// If User Code Is Provided Then It Will Take Action On All Selected User Other Wise It Will Take Action On Only Current User
router.post(
  "/update",
  verifyAccessToken,
  verifyCaptchaToken,
  isUserExists,
  verifyLogoutStatus,
  updateLoginStatus,
  isUserBlock,
  inputValidation.updateInputValidation,
  apiValidation.updateApiValidation,
  profile.update,
);

// If User Code Is Provided Then It Will Take Action On All Selected User Other Wise It Will Take Action On Only Current User
router.post(
  "/block",
  verifyAccessToken,
  verifyCaptchaToken,
  isUserExists,
  verifyLogoutStatus,
  updateLoginStatus,
  isUserBlock,
  inputValidation.blockInputValidation,
  apiValidation.blockApiValidation,
  profile.block,
);

// If User Code Is Provided Then It Will Take Action On All Selected User Other Wise It Will Take Action On Only Current User
router.post(
  "/unblock",
  verifyAccessToken,
  verifyCaptchaToken,
  isUserExists,
  verifyLogoutStatus,
  updateLoginStatus,
  inputValidation.unBlockInputValidation,
  apiValidation.unBlockApiValidation,
  profile.unblock,
);

// If User Code Is Provided Then It Will Take Action On All Selected User Other Wise It Will Take Action On Only Current User
router.post(
  "/delete",
  verifyAccessToken,
  verifyCaptchaToken,
  isUserExists,
  verifyLogoutStatus,
  updateLoginStatus,
  inputValidation.deleteInputValidation,
  apiValidation.deleteApiValidation,
  profile.remove,
);

// If User Code Is Provided Then It Will Take Action On All Selected User Other Wise It Will Take Action On Only Current User
router.post(
  "/change/password",
  verifyAccessToken,
  verifyCaptchaToken,
  isUserExists,
  verifyLogoutStatus,
  updateLoginStatus,
  isUserBlock,
  inputValidation.changePasswordInputValidation,
  apiValidation.changePasswordApiValidation,
  profile.changePassword,
);

export const profileRouter = router;
