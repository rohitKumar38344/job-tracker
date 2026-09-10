import crypto from "node:crypto";

export function generateRefreshToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashRefreshToken(token)

  return {
    token,
    tokenHash,
  };
}

export function hashRefreshToken(token: string){
  return crypto.createHash("sha256").update(token).digest("hex");
}