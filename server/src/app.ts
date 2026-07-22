import express from "express";
import cors from "cors";

import urlRoutes from "./routes/url.routes";
import {redirectUrl} from "./controllers/url.controller";

const app = express();
// middleware
app.use(cors());
app.use(express.json());

// Health checkk
app.get("/", (req, res) => {
    res.json({
        success : true, 
        message : "URL Shortener API is running",
    });
});

app.use("/api/url", urlRoutes);

app.get("/:code", redirectUrl);

export default app;