import Router from "express";
import {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    validatePasswordReset,
    resetPassword
} from "../controllers/auth.controller";
const router = Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.get("/reset-password/:token", validatePasswordReset);
router.post("/reset-password/:token", resetPassword);
export default router;