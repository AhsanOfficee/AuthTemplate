// Import the "express" module along with "Request" and "Response" types from express
import express, { Express, Request, Response } from "express";
import { authRouter } from "./routes/auth/auth";
import { profileRouter } from "./routes/profile/profile";
import bodyParser from "body-parser";
import { API_CONSOLE, API_SUCCESS_RESPONSE } from "./enums/enum";

// Create an Express application
const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for the root path ("/")
app.get("/", (req: Request, res: Response) => {
  // Send a response to the client
  console.debug(
    API_CONSOLE.API_CALLED,
    API_CONSOLE.API_REQ_METHOD,
    req.method,
    API_CONSOLE.API_REQ_FULL_ENDPOINT,
    req.originalUrl,
  );
  res.send(API_SUCCESS_RESPONSE.DEFAULT_ROUTE_MESSAGE);
});

// Route For The Auth
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

export default app;
