import crypto from "crypto";

export const createPasswordResetToken = () => crypto.randomBytes(32).toString("hex");

export const isPasswordResetTokenExpired = (expiresAt: Date) =>
  expiresAt.getTime() <= Date.now();
