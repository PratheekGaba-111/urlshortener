"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const url_controller_1 = require("./controllers/url.controller");
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health checkk
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "URL Shortener API is running",
    });
});
app.use("/api/url", url_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.get("/:code", url_controller_1.redirectUrl);
exports.default = app;
