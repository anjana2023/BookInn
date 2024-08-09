import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import serverConfig from "./frameworks/webserver/server";
import routes from "./frameworks/webserver/routes";
import expressConfig from "./frameworks/webserver/expressConfig";
import connectDB from "./frameworks/database/connection";
import errorHandlingMiddleware from "./frameworks/webserver/middleware/errorhandlerMiddleware";
import AppError from "./utils/appError";
import socketConfig from "./frameworks/webserver/webSocket";
const app: Application = express();
import cors from "cors"; 

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "https://anjanabookinn.netlify.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

socketConfig(io);

expressConfig(app);

connectDB();

routes(app);
app.use(errorHandlingMiddleware);

serverConfig(server).startServer();
