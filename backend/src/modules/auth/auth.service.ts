import argon2 from "argon2";
import {
  createRefreshToken,
  findUserByEmail,
  insertUser,
  revokeRefreshTokenByHash,
  rotateRefreshToken,
} from "./auth.repository";
import { AppError } from "../../errors/AppError";
import { signAccessToken } from "../../utils/jwt";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/refresh-token";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      "An account with this email already exists.",
      409,
      "ACCOUNT_ALREADY_EXISTS",
    );
  }

  const passwordHash = await argon2.hash(data.password);

  const user = await insertUser({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  return {
    userId: user.user_id,
    name: user.name,
    email: user.email,
  };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await findUserByEmail(data.email);
  if (!user)
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");

  const passwordMatches = await argon2.verify(
    user.password_hash,
    data.password,
  );
  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const accessToken = signAccessToken(user.user_id);
  const { token, tokenHash } = generateRefreshToken();
  await createRefreshToken(user.user_id, tokenHash);
  return {
    user: {
      userId: user.user_id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken: token,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);

  const { token: newRefreshToken, tokenHash: newTokenHash } =
    generateRefreshToken();

  const rotatedToken = await rotateRefreshToken(tokenHash, newTokenHash);
  const accessToken = signAccessToken(Number(rotatedToken.user_id));
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(refreshToken: string) {
  const hashedToken = hashRefreshToken(refreshToken);

  return revokeRefreshTokenByHash(hashedToken);
}
