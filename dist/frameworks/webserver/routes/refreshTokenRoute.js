"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authService_1 = require("../../servies/authService");
const tokenController_1 = __importDefault(require("../../../adapters/tokenController"));
const userDbRepositories_1 = require("../../../app/interfaces/userDbRepositories");
const userRepositoryMongoDB_1 = require("../../database/repositories/userRepositoryMongoDB");
const authServices_1 = require("../../../app/service-interface/authServices");
const ownerDbInterface_1 = require("../../../app/interfaces/ownerDbInterface");
const ownerRepository_1 = require("../../database/repositories/ownerRepository");
const refreshTokenRoute = () => {
    const router = express_1.default.Router();
    const controller = (0, tokenController_1.default)(authServices_1.authServiceInterface, authService_1.authService, userDbRepositories_1.userDbRepository, userRepositoryMongoDB_1.userRepositoryMongoDB, ownerDbInterface_1.ownerDbInterface, ownerRepository_1.ownerDbRepository);
    router.get("/accessToken", controller.returnAccessToClient);
    router.post("/refresh_token", controller.getNewAccessToken);
    return router;
};
exports.default = refreshTokenRoute;
