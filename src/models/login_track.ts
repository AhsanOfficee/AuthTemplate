module.exports = (sequelize: any, DataTypes: any) => {
  const login_track = sequelize.define(
    "login_track",
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
        allowNull: false,
      },
      loginTime: {
        type: "TIMESTAMP",
        allowNull: false,
      },
      validLoginTime: {
        type: "TIMESTAMP",
        allowNull: false,
      },
      logoutFlag: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      logoutTime: {
        type: "TIMESTAMP",
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

  return login_track;
};
