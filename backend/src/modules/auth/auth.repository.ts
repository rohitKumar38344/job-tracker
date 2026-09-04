import { pool } from "../../db";

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
};

export async function insertUser(data: CreateUserData) {
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING
     user_id,
     name,
     email,
     created_at,
     updated_at`,
    [data.name, data.email, data.passwordHash],
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await pool.query(
    `
    SELECT user_id, email, password_hash, created_at, updated_at FROM users WHERE email = $1`,
    [email],
  );
  return result.rows[0] ?? null;
}

export async function findUserById(userId: number) {
  const result = await pool.query(
    `
    SELECT user_id, email, created_at, updated_at FROM users WHERE user_id = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}
