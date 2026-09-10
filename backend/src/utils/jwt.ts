import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { z } from "zod";

const accessTokenPayloadSchema = z.object({
  userId: z.number().int().positive(),
});
export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

export function signAccessToken(userId: number) {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "30m",
    subject: String(userId),
  });
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid JWT payload");
  }

  return accessTokenPayloadSchema.parse(decoded);
}