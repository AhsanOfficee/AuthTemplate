import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { FUNCTION_CONSOLE } from "../enums/enum";
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
  // console.debug("encryptedData Data:", encryptedData);

  return encryptedData;
};

// Decrypt the Encrypt string
export const decryption = (password: string) => {
  console.debug(FUNCTION_CONSOLE.DECRYPTION_FUNCTION_CALLED);

  const secretKey: string = `${process.env.secretKey}`;
  const encryptedData = password;

  // **Decrypt the data**
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  // console.debug("Decrypted Data:", decryptedData);

  return decryptedData;
};

// Hash the normal string
export const hashing = (password: string) => {
  console.debug(FUNCTION_CONSOLE.HASHING_FUNCTION_CALLED);

  // Generate a salt for added security
  const salt = CryptoJS.lib.WordArray.random(
    parseInt(`${process.env.saltValue}`),
  ).toString();

  // Hash the password with the salt
  const saltedHash = CryptoJS.SHA256(password + salt).toString();

  // Store the salted hash and salt in the database (not the plain password)
  // console.debug("Salt:", salt);
  // console.debug("Salted Hash:", saltedHash);

  return { salt, saltedHash };
};

// Hash the input password with the stored salt And Return True If Input Hash Matches With Stored Hash;
export const compareHashing = (
  saltValue: string,
  hashValue: string,
  password: string,
) => {
  console.debug(FUNCTION_CONSOLE.MATCH_PASSWORD_FUNCTION_CALLED);

  // Simulate stored data (from the database)
  const storedSalt = saltValue; // This should be stored in your database
  const storedHash = hashValue; // This should be stored in your database
  // console.debug("storedSalt",storedSalt,"  ",hashValue)

  // User input (password provided during login)
  const inputPassword = password;

  // Hash the input password with the stored salt
  const inputHash = CryptoJS.SHA256(inputPassword + storedSalt).toString();

  // Compare the input hash with the stored hash
  if (inputHash === storedHash) return true;
  else return false;
};
