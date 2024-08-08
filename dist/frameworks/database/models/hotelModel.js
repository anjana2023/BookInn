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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    streetAddress: {
        type: String,
        required: true,
    },
    landMark: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
}, { _id: false });
const hotelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 32,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Owner",
    },
    place: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    propertyRules: [String],
    rooms: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Room"
        }],
    stayType: {
        type: String,
        required: true,
    },
    amenities: [String],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    hotelDocument: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    status: {
        type: String,
        default: "pending",
    },
    isVerified: {
        type: String,
        enum: ["rejected", "cancelled", "pending", "verified"],
        default: "pending",
    },
    rejectedReason: {
        type: String,
        default: "",
    },
    listed: {
        type: Boolean,
        default: true,
    },
    imageUrls: [String],
    unavailableDates: [{ type: Date }],
}, { timestamps: true });
hotelSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDate = new Date();
        this.unavailableDates = this.unavailableDates.filter((date) => date >= currentDate);
        next();
    });
});
hotelSchema.index({ location: "2dsphere" });
const Hotel = (0, mongoose_1.model)("Hotel", hotelSchema);
exports.default = Hotel;
