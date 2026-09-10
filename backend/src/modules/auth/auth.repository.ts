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

export async function createRefreshToken(userId: number, tokenHash: string) {
  const result = await pool.query(
    `
    INSERT INTO refresh_tokens (
      user_id,
      token_hash,
      expires_at
    )
    VALUES ($1, $2, NOW() + INTERVAL '7 days')
    RETURNING refresh_token_id`,
    [userId, tokenHash],
  );
  return result.rows[0];
}

export async function findRefreshTokenByHash(tokenHash: string) {
  const result = await pool.query(`
    SELECT
      refresh_token_id,
      user_id,
      expires_at,
      revoked_at
    FROM refresh_tokens
    WHERE token_hash = $1`,[tokenHash])

  return result.rows[0];
}

export async function revokeRefreshTokenByHash(tokenHash: string){
  const result = await pool.query(`
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token_hash = $1
      AND revoked_at IS NULL
    RETURNING refresh_token_id`, [tokenHash]);

  return result.rows[0]
}