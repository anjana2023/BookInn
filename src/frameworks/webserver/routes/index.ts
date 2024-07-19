import { Application, Request, Response } from "express";
import authRouter from "./auth";
import ownerRouter from "./owner";
import tokenRouter from "./refreshTokenRoute"
import adminRouter from "./admin";
import chatRoute from "./chat/chat";
const routes = (app: Application) => {
  app.use("/api/user", authRouter());
  app.use("/api/token", tokenRouter());
  app.use("/api/owner", ownerRouter());
  app.use("/api/admin", adminRouter());
  app.use("/api/chat", chatRoute());
};
export default routes;
