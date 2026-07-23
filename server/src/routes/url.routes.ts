import { Router } from "express";
import { shortenUrl, getMyUrls, subscribeToUrlClicks} from "../controllers/url.controller";
import {auth} from "../middleware/auth";
const router = Router();

router.post("/shorten", auth, shortenUrl);
router.get("/my-urls", auth, getMyUrls);
router.get("/events", subscribeToUrlClicks);
export default router;
