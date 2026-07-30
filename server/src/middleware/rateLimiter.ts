import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
});

export const urlLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 200,
    message: {
        message: "URL creation limit exceeded."
    }
});