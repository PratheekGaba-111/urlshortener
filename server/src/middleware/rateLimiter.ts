import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Too many login attempts. Try again later."
    }
});

export const urlLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    message: {
        message: "URL creation limit exceeded."
    }
});