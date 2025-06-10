module.exports = (sequelize: any, DataTypes: any) => {
  const password = sequelize.define(
    "password",
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
      saltValue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
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

  return password;
};
