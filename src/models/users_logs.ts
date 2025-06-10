module.exports = (sequelize: any, DataTypes: any) => {
  const users_logs = sequelize.define(
    "users_logs",
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
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phoneCode: {
        type: DataTypes.STRING(5),
      },
      phoneNo: {
        type: DataTypes.BIGINT,
      },
      remarks: {
        type: DataTypes.TEXT,
      },
      typeOfApiAction: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      typeOfEndPoint: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
      },
      isActiveActionDate: {
        type: "Timestamp",
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

  return users_logs;
};
