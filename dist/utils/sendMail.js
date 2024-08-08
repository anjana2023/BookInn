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
const mailServices_1 = __importDefault(require("../frameworks/servies/mailServices"));
const sendMail = (email, emailSubject, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield mailServices_1.default.sendMail({
            from: "BookInn <anjananjana8@gmail.com>",
            to: email,
            subject: emailSubject,
            html: content,
        });
    }
    catch (error) {
        console.log("Error in sending mail ", error);
    }
});
exports.default = sendMail;
