"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const owner_1 = __importDefault(require("./owner"));
const refreshTokenRoute_1 = __importDefault(require("./refreshTokenRoute"));
const admin_1 = __importDefault(require("./admin"));
const chat_1 = __importDefault(require("./chat/chat"));
const routes = (app) => {
    app.use("/api/user", (0, auth_1.default)());
    app.use("/api/token", (0, refreshTokenRoute_1.default)());
    app.use("/api/owner", (0, owner_1.default)());
    app.use("/api/admin", (0, admin_1.default)());
    app.use("/api/chat", (0, chat_1.default)());
};
exports.default = routes;
