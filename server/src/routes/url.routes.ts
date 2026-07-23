import { Router } from "express";
import { shortenUrl, getMyUrls} from "../controllers/url.controller";
import {auth} from "../middleware/auth";
const router = Router();

router.post("/shorten", auth, shortenUrl);
router.get("/my-urls", auth, getMyUrls);
export default router;