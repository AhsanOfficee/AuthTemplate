import { FUNCTION_CONSOLE, OTP_TYPE } from "../enums/enum";
import { generateUniqueOtp } from "./otpFunctions";
import dotenv from "dotenv";
dotenv.config;

export const signUpHtml = async (
  name: string,
  email: string,
  userCode: number,
) => {
  console.debug(FUNCTION_CONSOLE.SIGN_UP_HTML_FUNCTION_CALLED);

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <tr>
                <td align="center" style="padding: 30px 0;">
                  <h2 style="color: #333;">👋 Welcome to Our Platform!</h2>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="font-size: 16px; color: #555;">
                    Hi <strong>${name}</strong>,
                  </p>
                  <p style="font-size: 16px; color: #555;">
                    Thank you for signing up! Below are your account details:
                  </p>
                  <table cellpadding="10" cellspacing="0" border="0" style="margin-top: 10px; font-size: 15px; color: #333;">
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>${name}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>${email}</td>
                    </tr>
                    <tr>
                      <td><strong>User Id:</strong></td>
                      <td>${userCode}</td>
                    </tr>
                  </table>
                  <p style="font-size: 14px; color: #888; margin-top: 30px;">
                    If you have any questions, feel free to contact us.
                  </p>
                  <p style="font-size: 16px; color: #555;">
                    Regards,<br/>${process.env.teamName}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 20px;">
                  <!-- <small style="color: #aaa;">&copy; 2025 ${process.env.companyName}</small> -->
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
  return { html };
};

export const forgetPasswordHtml = async () => {
  console.debug(FUNCTION_CONSOLE.FORGET_PASSWORD_HTML_FUNCTION_CALLED);

  const otp = await generateUniqueOtp(OTP_TYPE.FORGET_PASSWORD);
  const time = parseInt(process.env.otpExpiryTime || "5");

  const html = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="20" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
                    <tr>
                      <td align="center" style="padding: 30px 0;">
                        <h2 style="color: #333;">🔐 Forgot Your Password?</h2>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="color: #555; font-size: 16px;">
                          We received a request to reset your password. Use the OTP below to proceed:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                          <span style="display: inline-block; padding: 12px 24px; font-size: 24px; background-color: #f0f0f0; border-radius: 5px; font-weight: bold; letter-spacing: 2px;">
                            <strong>${otp}</strong>
                          </span>
                        </div>
                        <p style="color: #888; font-size: 14px;">
                          This OTP is valid for <strong>${time} minutes</strong>. If you didn’t request a password reset, you can safely ignore this message.
                        </p>
                        <p style="color: #555; font-size: 16px; margin-top: 30px;">
                          Thank you,<br/>${process.env.teamName}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 20px;">
                        <small style="color: #aaa;">&copy; 2025 Your App. All rights reserved.</small>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `;
  return { html, otp, time };
};
