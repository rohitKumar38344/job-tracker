import { pool } from "../../db";
import { AppError } from "../../errors/AppError";

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
    SELECT user_id, name, email, created_at, updated_at FROM users WHERE user_id = $1`,
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
  const result = await pool.query(
    `
    SELECT
      refresh_token_id,
      user_id,
      expires_at,
      revoked_at
    FROM refresh_tokens
    WHERE token_hash = $1`,
    [tokenHash],
  );

  return result.rows[0];
}

export async function revokeRefreshTokenByHash(tokenHash: string) {
  const result = await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token_hash = $1
      AND revoked_at IS NULL
    RETURNING refresh_token_id`,
    [tokenHash],
  );

  return result.rows[0];
}

export async function rotateRefreshToken(
  tokenHash: string,
  newTokenHash: string,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        SELECT
          refresh_token_id,
          user_id,
          expires_at,
          revoked_at
        FROM refresh_tokens
        WHERE token_hash = $1
        FOR UPDATE
      `,
      [tokenHash],
    );

    const storedToken = result.rows[0];

    if (!storedToken) {
      throw new AppError(
        "Invalid refresh token.",
        401,
        "INVALID_REFRESH_TOKEN",
      );
    }

    if (storedToken.revoked_at !== null) {
      throw new AppError(
        "Refresh token has been revoked.",
        401,
        "REFRESH_TOKEN_REVOKED",
      );
    }

    if (storedToken.expires_at < new Date()) {
      throw new AppError(
        "Refresh token has expired.",
        401,
        "REFRESH_TOKEN_EXPIRED",
      );
    }

    await client.query(
      `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE refresh_token_id = $1
      `,
      [storedToken.refresh_token_id],
    );

    const newTokenResult = await client.query(
      `
        INSERT INTO refresh_tokens (
          user_id,
          token_hash,
          expires_at
        )
        VALUES (
          $1,
          $2,
          NOW() + INTERVAL '7 days'
        )
        RETURNING refresh_token_id, user_id
      `,
      [storedToken.user_id, newTokenHash],
    );

    await client.query("COMMIT");

    return newTokenResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
