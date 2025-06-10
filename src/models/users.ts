module.exports = (sequelize: any, DataTypes: any) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userCode: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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

  // Foreign key relationship
  users.associate = (models: any) => {
    // this is the best way to maintain primary key(pk) and foreign key(fk)

    // password
    users.hasMany(models.password, {
      sourceKey: "userCode", // column name to be use as primary key(pk) and the value must be primary key or unique constant of the table
      foreignKey: "userCode", // column name to be use as foreign key(fk) in the table
      // constraints : true
    });

    // login_track
    users.hasMany(models.login_track, {
      sourceKey: "userCode", // column name to be use as primary key(pk) and the value must be primary key or unique constant of the table
      foreignKey: "userCode", // column name to be use as foreign key(fk) in the table
      // constraints : true
    });

    // users_logs
    users.hasMany(models.users_logs, {
      sourceKey: "userCode", // column name to be use as primary key(pk) and the value must be primary key or unique constant of the table
      foreignKey: "userCode", // column name to be use as foreign key(fk) in the table
      // constraints : true
    });
  };

  return users;
};
