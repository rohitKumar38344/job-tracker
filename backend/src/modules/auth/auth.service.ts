import argon2 from "argon2";
import { findUserByEmail, insertUser } from "./auth.repository";
import { AppError } from "../../errors/AppError";
import { singAccessToken } from "../../utils/jwt";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
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
  if (!user) throw new AppError("Invalid email or password", 401);
  console.log(user);
  const passwordMatches = await argon2.verify(
    user.password_hash,
    data.password,
  );
  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }
  const accessToken = singAccessToken(user.user_id);
  return {
    user: {
      userId: user.user_id,
      name: user.name,
      email: user.email,
    },
    accessToken,
  };
}
