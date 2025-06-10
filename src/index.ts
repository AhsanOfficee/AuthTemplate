import express from "express";
import db from "./models/model";
import path from "path";
import app from "./rootRoutes";
import dotenv from "dotenv";
import { SERVER_START } from "./enums/enum";
dotenv.config();

// View Your Static Files
app.use("/static", express.static(path.join(__dirname, "../public")));

// Specify the port number for the server
const port = process.env.INTERNAL_PORT;

// Start the server and listen on the specified port
app.listen(port, () => {
  db.sequelize.sync({ alter: true });
  // Log a message when the server is successfully running
  console.debug(`${SERVER_START.MESSAGE}${port}`);
});
