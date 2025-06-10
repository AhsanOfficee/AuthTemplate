export enum SERVER_START {
  MESSAGE = "Server is running on http://localhost:",
}

export enum COLOR_CONSOLE {
  DARK_GREEN = "\x1b[36m%s\x1b[0m",
}

export enum API_CONSOLE {
  API_CALLED = "Api Called: ",
  INPUT_VALIDATION_CALLED = "Input Validation Middleware Called: ",
  VERIFY_ACCESS_TOKEN_CALLED = "Verify Access Token Middleware Called: ",
  VERIFY_REFRESH_ACCESS_TOKEN_CALLED = "Verify Refresh Access Token Middleware Called: ",
  VERIFY_CAPTCHA_ACCESS_TOKEN_CALLED = "Verify Captcha Access Token Middleware Called: ",
  API_VALIDATION_CALLED = "API VALIDATION Middleware CALLED: ",
  API_REQ_METHOD = "API_REQ_METHOD: ",
  API_REQ_FULL_ENDPOINT = "API_REQ_FULL_ENDPOINT: ",
  VERIFY_LOGOUT_STATUS_CALLED = "Verify Logout Status Middleware Called: ",
  UPDATE_LOGIN_STATUS_CALLED = "Update Login Status Middleware Called: ",
  IS_USER_ACTIVE_CALLED = "Is User Active Middleware Called ",
  IS_USER_BLOCK_CALLED = "Is User Block Middleware Called ",
  IS_USER_EXISTS_CALLED = "Is User Exists Middleware Called ",
  IS_USER_DELETED_CALLED = "Is User Deleted Middleware Called ",
}

export enum STATUS {
  SUCCESS = "Success",
  FAILED = "Failed",
}

export enum STATUS_CODE {
  SUCCESS = 200,
  BAD_INPUT = 400,
  CONFLICT = 409,
  UN_AUTHORIZED = 403,
  INTERNAL_SERVER_ERROR = 500,
  LOGIN_TIMEOUT = 419,
}

export enum API_SUCCESS_RESPONSE {
  DEFAULT_ROUTE_MESSAGE = "Hello, TypeScript + Node.js + Express!",
  SIGN_UP_MESSAGE = "Sign Up Successfully",
  LOGIN_MESSAGE = "Login Successfully",
  LOGOUT_MESSAGE = "Logout Successfully",
  TOKEN_GENERATED_SUCCESSFULLY = "Token Generated Successfully",
  CAPTCHA_TOKEN_GENERATED_SUCCESSFULLY = "Captcha Token Generated Successfully",
  RECORD_FETCHED_SUCCESSFULLY = "Record Fetched Successfully",
  BLOCKED_SUCCESSFULLY = "Blocked Successfully",
  ACTIVATED_SUCCESSFULLY = "Activated Successfully",
  ACCOUNT_DELETED_SUCCESSFULLY = "Account Deleted Successfully",
  UPDATED_SUCCESSFULLY = "Updated Successfully",
  PASSWORD_UPDATED_SUCCESSFULLY = "Password Updated Successfully",
}

export enum API_ERROR_RESPONSE {
  PASSWORD_MISMATCH = "Password Mismatch",
  USER_NOT_FOUND = "User Not Found!",
  INVALID_USER_OR_PASSWORD = "Invalid User/Password!",
  NO_TOKEN_FOUND = "No Token Found!",
  INVALID_ACCESS_TOKEN = "Invalid Access Token!",
  INVALID_REFRESH_TOKEN = "Invalid Refresh Token!",
  INVALID_CAPTCHA_TOKEN = "Invalid Captcha Token!",
  INVALID_CAPTCHA = "Invalid Captcha Please Try Again!",
  ALREADY_LOGGED_IN = "User Already Logged In",
  SESSION_EXPIRED = "Session Expired Please Login Again",
  USER_bLOCK = "User Is Blocked",
  USER_IS_ALREADY_ACTIVE = "User Is Already Active",
  ACCOUNT_ALREADY_DELETED = "Account Already Deleted",
  RECORD_NOT_FOUND = "Record Not Found",
  EMAIL_ALREADY_EXISTS = "Email Already Exists",
  PHONE_NO_ALREADY_EXISTS = "Phone Number Already Exists",
}

export enum ZOD_FIELDS {
  NAME = "Name is required.",
  EMAIL = "Invalid email",
  PHONE_CODE_MIN = "Phone code must contain at least 2 digits",
  PHONE_CODE_MAX = "Phone code max contain 5 digits",
  PHONE_NO = "Phone must contain exact 10 digits",
  PASSWORD_MIN = "The password must be at least 8 characters long",
  PASSWORD_MAX = "The password must be a maximin 32 characters",
  CAPTCHA = "Need Exactly 6 Characters",
  BOOLEAN = "It Must Be A True Or False",
}

export enum FUNCTION_CONSOLE {
  ENCRYPTION_FUNCTION_CALLED = "Encryption Function Called: ",
  DECRYPTION_FUNCTION_CALLED = "Decryption Function Called: ",
  HASHING_FUNCTION_CALLED = "Hashing Function Called: ",
  MATCH_PASSWORD_FUNCTION_CALLED = "Match Password Function Called: ",
  ERROR_HANDLER_CALLED = "Error Handel Function Called: ",
  THROW_ERROR_HANDLER_CALLED = "Throw Error Handel Function Called: ",
  GENERATE_USER_CODE_FUNCTION_CALLED = "Generate User Code Function Called: ",
}

export enum USER_TYPE {
  CONTRACTUAL_BOARD = "Contractual (Board)",
  CONTRACTUAL_AGENCY = "Contractual (Agency)",
  DEPUTATION = "Deputation",
}
