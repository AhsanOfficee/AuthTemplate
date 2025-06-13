import { Request } from "express";
import db from "../models/model";
import { decodeToken } from "./generateToken";
import { splitCamelCaseAndCapitalizeEachWord } from "./otherFunctions";
import { logValueObject } from "./typeValidation";
import { FUNCTION_CONSOLE } from "../enums/enum";

/*
  Function to store logs of user action  
 */

export const logs = (
  req: Request,
  query: string,
  userCode?: number,
  isMiddlewareCalled?: boolean,
) => {
  console.debug(FUNCTION_CONSOLE.SAVE_LOGS_FUNCTION_CALLED);

  // Checking for user code
  let info = null;
  if (userCode) info = { userCode: userCode };
  else info = decodeToken(req);

  // Modifying  End Point
  const splitUrl = req.originalUrl.split("/");
  const actionLocation = splitCamelCaseAndCapitalizeEachWord(
    splitUrl[splitUrl.length - 1],
  );

  // Checking for login and logout
  let loginTime = null;
  let logoutTime = null;
  if (actionLocation === "Login") loginTime = new Date();
  if (actionLocation === "Logout") logoutTime = new Date();

  // Fetching queryExecutionCode from full query
  let queryExecutionCode = undefined;
  const newSplit = query.split("Executing (")[1];
  queryExecutionCode = newSplit.split("):")[0];

  const objectData = {
    userCode: info.userCode,
    ipAddress: req.ip,
    actionLocation: actionLocation,
    actionApi: req.originalUrl,
    queryExecutionCode: queryExecutionCode,
    query: query,
    loginTime: loginTime,
    logoutTime: logoutTime,
    isMiddlewareCalled: isMiddlewareCalled,
  };
  db.logs.create(objectData);
  return;
};

// Function to create query and modify the query and save in the logs
export const logQuery = async (
  req: Request,
  sql: string | any,
  value: logValueObject | any,
  isCommitted?: boolean,
  userCode?: number,
  protectPassword?: boolean,
  isMiddlewareCalled?: boolean,
) => {
  console.debug(FUNCTION_CONSOLE.FILTER_LOGS_FUNCTION_CALLED);

  // If isCommitted is true that means the transaction is completed successfully
  if (isCommitted) {
    const code = await db.logs.findOne({
      order: [["id", "desc"]],
      limit: 1,
      attributes: ["queryExecutionCode"],
      raw: true,
    });
    // console.debug("code", code);
    await db.logs.update(
      { isCommitted: true },
      { where: { queryExecutionCode: code.queryExecutionCode } },
    );
    return;
  }

  // console.debug("sql: ",sql.split("RETURNING")[0])

  // Remove password from logs
  if (protectPassword) {
    (value.bind[1] = "saltValue"), (value.bind[2] = "encryptedPassword");
  }

  // Add the sql query and values in a single variable
  let full_query = sql;
  const sqlQuery = sql.split("RETURNING")[0];
  if (value.bind !== null && value.bind !== undefined)
    full_query = ` Query ---> ${sqlQuery}    Values ---> [${value.bind}]`;

  // If case to handel if there is a userCode or not
  if (userCode) logs(req, full_query, userCode, isMiddlewareCalled);
  else logs(req, full_query, undefined, isMiddlewareCalled);

  return;
};

export const apiEndPoint = (req: Request) => {
  console.debug(FUNCTION_CONSOLE.SPLIt_END_POINT_FUNCTION_CALLED);

  // Modifying  End Point
  const splitUrl = req.originalUrl.split("/");
  const actionLocation = splitCamelCaseAndCapitalizeEachWord(
    splitUrl[splitUrl.length - 1],
  );
  return actionLocation;
};
