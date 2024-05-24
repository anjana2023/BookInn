import { Application, Request, Response } from "express";
import authRouter from "./auth";
import ownerRouter from "./owner";
import adminRouter from "./admin";
const routes = (app: Application) => {
  app.use("/api/user", authRouter());
  app.use("/api/owner", ownerRouter());
  app.use("/api/admin", adminRouter());
};
export default routes;
