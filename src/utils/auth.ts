import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + process.env.DATABASE_URL)
    .digest("hex");
}
