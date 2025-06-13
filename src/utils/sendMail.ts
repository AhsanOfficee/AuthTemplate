import FormData, { from } from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";
import { FUNCTION_CONSOLE } from "../enums/enum";
dotenv.config();

export const sendMail = async (
  fromEmail: string,
  to: string[],
  subject: string,
  html: string,
  cc?: string[],
) => {
  try {
    console.debug(FUNCTION_CONSOLE.SEND_MAIL_FUNCTION_CALLED);

    const apiKey = process.env.MAILGUN_API_KEY || "";
    const domain = process.env.MAILGUN_DOMAIN || "";

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: apiKey,
    });
    const messageData: object | any = {
      from: fromEmail,
      to: to,
      subject: subject,
      html: html,
    };
    if (cc && cc.length > 0) messageData.cc = cc;

    await mg.messages
      .create(domain, messageData)
      .then((response: any) => {
        console.debug("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
      });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
