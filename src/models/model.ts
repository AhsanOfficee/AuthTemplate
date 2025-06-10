"use strict";
import fs from "fs";
import path from "path";
const Sequelize = require("sequelize");
import process from "process";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
import { dbConfig } from "../config/config";
const config = dbConfig[env];

type dbType<T extends string> = {
  [key: string]: T;
};

const db: dbType<any> = {};

let sequelize: any;
if (config) {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      (file.indexOf(".test.ts") === -1 || file.indexOf(".test.js") === -1)
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ((db[modelName] as any).associate) {
    (db[modelName] as any).associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
