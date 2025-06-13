import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { FUNCTION_CONSOLE } from "./src/enums/enum";
dotenv.config();

// Encrypt normal string
export const encryption = (password: string) => {
  console.debug(FUNCTION_CONSOLE.ENCRYPTION_FUNCTION_CALLED);

  const secretKey: string = `${process.env.secretKey}`;
  const dataToEncrypt = password;

  // Encrypt the data
  const encryptedData = CryptoJS.AES.encrypt(
    dataToEncrypt,
    secretKey,
  ).toString();
  console.debug("encryptedData Data:", encryptedData);

  return encryptedData;
};

encryption("Testing@123");
