"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.default)();
router.post("/register", auth_controller_1.register);
router.get("/verify/:token", auth_controller_1.verifyEmail);
router.post("/login", auth_controller_1.login);
router.post("/forgot-password", auth_controller_1.requestPasswordReset);
router.get("/reset-password/:token", auth_controller_1.validatePasswordReset);
router.post("/reset-password/:token", auth_controller_1.resetPassword);
exports.default = router;
