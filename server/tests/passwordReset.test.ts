import test from "node:test";
import assert from "node:assert/strict";
import { createPasswordResetToken, isPasswordResetTokenExpired } from "../src/utils/passwordReset";

test("creates a reset token and marks it as active before expiry", () => {
  const token = createPasswordResetToken();

  assert.equal(typeof token, "string");
  assert.equal(token.length > 0, true);
  assert.equal(isPasswordResetTokenExpired(new Date(Date.now() + 30 * 60 * 1000)), false);
});

test("marks a token as expired when the expiry time is in the past", () => {
  assert.equal(isPasswordResetTokenExpired(new Date(Date.now() - 1000)), true);
});
