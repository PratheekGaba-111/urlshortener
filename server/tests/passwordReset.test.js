"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const passwordReset_1 = require("../src/utils/passwordReset");
(0, node_test_1.default)("creates a reset token and marks it as active before expiry", () => {
    const token = (0, passwordReset_1.createPasswordResetToken)();
    strict_1.default.equal(typeof token, "string");
    strict_1.default.equal(token.length > 0, true);
    strict_1.default.equal((0, passwordReset_1.isPasswordResetTokenExpired)(new Date(Date.now() + 30 * 60 * 1000)), false);
});
(0, node_test_1.default)("marks a token as expired when the expiry time is in the past", () => {
    strict_1.default.equal((0, passwordReset_1.isPasswordResetTokenExpired)(new Date(Date.now() - 1000)), true);
});
