"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordResetTokenExpired = exports.createPasswordResetToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createPasswordResetToken = () => crypto_1.default.randomBytes(32).toString("hex");
exports.createPasswordResetToken = createPasswordResetToken;
const isPasswordResetTokenExpired = (expiresAt) => expiresAt.getTime() <= Date.now();
exports.isPasswordResetTokenExpired = isPasswordResetTokenExpired;
