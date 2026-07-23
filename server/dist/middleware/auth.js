"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const verifyToken_1 = require("../utils/verifyToken");
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }
    try {
        const decoded = (0, verifyToken_1.verifyToken)(token);
        req.user = {
            id: decoded.id
        };
        next();
    }
    catch {
        res.status(401).json({
            message: "Invalid Token"
        });
    }
};
exports.auth = auth;
