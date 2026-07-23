import Router from "express";
import {register, login, verifyEmail} from "../controllers/auth.controller";
const router = Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
export default router;