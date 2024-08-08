"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticateUser;
exports.authenticateOwner = authenticateOwner;
exports.authenticateAdmin = authenticateAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatus_1 = require("../../../types/httpStatus");
const config_1 = __importDefault(require("../../../config"));
function authenticateUser(req, res, next) {
    const access_token = req.headers.authorization;
    if (!access_token) {
        return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json("Your are not authenticated");
    }
    const tokenParts = access_token.split(" ");
    const token = tokenParts.length === 2 ? tokenParts[1] : null;
    if (!token) {
        return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json("Invalid access token format");
    }
    jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_SECRET, (err, user) => {
        if (err) {
            res
                .status(httpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Token is not valid" });
        }
        else {
            req.user = user.id;
            next();
        }
    });
}
// export async function authenticateOwner(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const access_token = req.headers.authorization;
//     if (!access_token) {
//       return res.status(HttpStatus.FORBIDDEN).json("You are not authenticated");
//     }
//     const tokenParts = access_token.split(" ");
//     const token = tokenParts.length === 2 ? tokenParts[1] : null;
//     if (!token) {
//       return res
//         .status(HttpStatus.FORBIDDEN)
//         .json("Invalid access token format");
//     }
//     const owner = jwt.verify(token, configKeys.ACCESS_SECRET) as JwtPayload;
//     if (owner.role === "owner") {
//       req.owner = owner.id;
//       return next();
//     }
//     return res.status(HttpStatus.FORBIDDEN).json({
//       success: false,
//       message: "You are not allowed to access this resource",
//       owner,
//     });
//   } catch (error) {
//     return res
//       .status(HttpStatus.FORBIDDEN)
//       .json({ success: false, message: "Token is not valid" });
//   }
// }
function authenticateOwner(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const access_token = req.headers.authorization;
            if (!access_token) {
                return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json("You are not authenticated");
            }
            const tokenParts = access_token.split(" ");
            const token = tokenParts.length === 2 ? tokenParts[1] : null;
            if (!token) {
                return res
                    .status(httpStatus_1.HttpStatus.FORBIDDEN)
                    .json("Invalid access token format");
            }
            const owner = jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_SECRET);
            if (owner.role === "owner") {
                req.owner = owner.id;
                return next();
            }
            return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to access this resource",
                owner,
            });
        }
        catch (error) {
            return res
                .status(httpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Token is not valid" });
        }
    });
}
// Admin authorization to get the access to routes in admin
function authenticateAdmin(req, res, next) {
    const access_token = req.headers.authorization;
    if (!access_token) {
        return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json("You are not authenticated");
    }
    // Extract the token from the header (assuming it's in the format "Bearer <token>")
    const tokenParts = access_token.split(" ");
    const token = tokenParts.length === 2 ? tokenParts[1] : null;
    if (!token) {
        return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json("Invalid access token format");
    }
    jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_SECRET, (err, decodedToken) => {
        if (err) {
            return res
                .status(httpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Token is not valid" });
        }
        if (decodedToken.role === "admin") {
            return next();
        }
        return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json({
            success: false,
            message: "You are not allowed to access this resource",
            user: decodedToken,
        });
    });
}
