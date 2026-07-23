import { Router } from "express";
import { shortenUrl } from "../controllers/url.controller";
import {auth} from "../middleware/auth";
const router = Router();

router.post("/shorten", auth, shortenUrl);

export default router;