"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server_1 = __importDefault(require("./frameworks/webserver/server"));
const routes_1 = __importDefault(require("./frameworks/webserver/routes"));
const expressConfig_1 = __importDefault(require("./frameworks/webserver/expressConfig"));
const connection_1 = __importDefault(require("./frameworks/database/connection"));
const errorhandlerMiddleware_1 = __importDefault(require("./frameworks/webserver/middleware/errorhandlerMiddleware"));
const webSocket_1 = __importDefault(require("./frameworks/webserver/webSocket"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
(0, webSocket_1.default)(io);
app.use((0, cors_1.default)({
    origin: "https://anjanabookinn.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
}));
(0, expressConfig_1.default)(app);
(0, connection_1.default)();
(0, routes_1.default)(app);
app.use(errorhandlerMiddleware_1.default);
(0, server_1.default)(server).startServer();
