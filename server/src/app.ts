import express from "express";
import cors from "cors";
import { authLimiter, urlLimiter } from "./middleware/rateLimiter";
import urlRoutes from "./routes/url.routes";
import authRoutes from "./routes/auth.routes";
import {redirectUrl} from "./controllers/url.controller";

const app = express();
// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authLimiter);
app.use("/api/url", urlLimiter);
app.set("trust proxy", 1);
// Health checkk
app.get("/", (req, res) => {
    res.json({
        success : true, 
        message : "URL Shortener API is running",
    });
});

app.use("/api/url", urlRoutes);
app.use("/api/auth", authRoutes);
app.get("/:code", redirectUrl);

export default app;