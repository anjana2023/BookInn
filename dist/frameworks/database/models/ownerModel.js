"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ownerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 32,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
    },
    password: {
        type: String,
        trim: true,
    },
    profilePic: {
        type: String,
        trim: true,
        default: "",
    },
    role: {
        type: String,
        enum: ["owner"],
        default: "owner",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    verificationCode: String,
}, { timestamps: true });
const Owner = (0, mongoose_1.model)("Owner", ownerSchema);
exports.default = Owner;
