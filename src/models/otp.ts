import { STATUS } from "../enums/enum";

module.exports = (sequelize: any, DataTypes: any) => {
  const otp = sequelize.define(
    "otp",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userCode: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      otpCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otpType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otpExpireTime: {
        type: "TIMESTAMP",
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Expired", "Verified"),
        allowNull: false,
        defaultValue: STATUS.PENDING,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isDeletedDate: {
        type: "Timestamp",
      },
    },
    { freezeTableName: true },
  );

  return otp;
};
