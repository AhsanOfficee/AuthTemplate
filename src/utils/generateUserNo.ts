import { Op } from "sequelize";
import db from "../models/model";
import { FUNCTION_CONSOLE, USER_TYPE } from "../enums/enum";

/****************** Function To Generate User Code  ********************/
export const generateUserCode = async (userType?: string) => {
  console.debug(FUNCTION_CONSOLE.GENERATE_USER_CODE_FUNCTION_CALLED);

  try {
    // For Permanent User Code | As Default Values
    let UserCode: number = 100000001;
    if (userType == USER_TYPE.CONTRACTUAL_BOARD) UserCode = 200000001;
    if (userType == USER_TYPE.CONTRACTUAL_AGENCY) UserCode = 300000001;
    if (userType == USER_TYPE.DEPUTATION) UserCode = 400000001;

    /************ Finding Last Employee ID ************/
    let nextNumber = await db.users.findOne({
      order: [["userCode", "desc"]],
      limit: 1,
      where: {
        [Op.and]: [
          { userCode: { [Op.gte]: UserCode } },
          { userCode: { [Op.lte]: UserCode + 999999990 } },
        ],
      },
      raw: true,
    });

    if (nextNumber) UserCode = parseInt(nextNumber.userCode) + 1;

    return UserCode;
  } catch (error) {
    console.debug("Error: ", error);
  }
};
/******************************************************************/
