import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";

import serverConfig from "./frameworks/webserver/server";
import routes from "./frameworks/webserver/routes";
import expressConfig from "./frameworks/webserver/expressConfig";
import connectDB from "./frameworks/database/connection";
import errorHandlingMiddleware from "./frameworks/webserver/middleware/errorhandlerMiddleware";
import AppError from "./utils/appError";
const app: Application = express();

const server = http.createServer(app);

expressConfig(app);

connectDB();

routes(app);
app.use(errorHandlingMiddleware);

serverConfig(server).startServer();
