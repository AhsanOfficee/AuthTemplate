module.exports = (sequelize: any, DataTypes: any) => {
  const logs = sequelize.define(
    "logs",
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
      ipAddress: {
        type: DataTypes.STRING,
      },
      actionLocation: {
        type: DataTypes.STRING,
      },
      actionApi: {
        type: DataTypes.TEXT,
      },
      queryExecutionCode: {
        type: DataTypes.TEXT,
      },
      query: {
        type: DataTypes.TEXT,
      },
      loginTime: {
        type: "TIMESTAMP",
      },
      logoutTime: {
        type: "TIMESTAMP",
      },
      isCommitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isMiddlewareCalled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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

  return logs;
};
