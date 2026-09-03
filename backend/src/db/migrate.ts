import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { pool } from ".";

const migrationsDir = path.resolve(process.cwd(), "migrations");

async function createMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getMigrationFiles(): Promise<string[]> {
  const files = await fs.readdir(migrationsDir);

  return files
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await pool.query(`
    SELECT version
    FROM schema_migrations
    ORDER BY version;
  `);

  return new Set(result.rows.map((row) => row.version));
}

async function runMigrations() {
  await createMigrationsTable();

  const migrationFiles = await getMigrationFiles();
  const appliedMigrations = await getAppliedMigrations();

  for (const file of migrationFiles) {
    if (appliedMigrations.has(file)) {
      console.log(`Skipping migration: ${file}`);
      continue;
    }

    console.log(`Applying migration: ${file}`);

    const sql = await fs.readFile(
      path.join(migrationsDir, file),
      "utf-8"
    );

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(sql);

      await client.query(
        `
        INSERT INTO schema_migrations (version)
        VALUES ($1)
        `,
        [file]
      );

      await client.query("COMMIT");

      console.log(`Applied migration: ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");

      console.error(`Migration failed: ${file}`);

      throw error;
    } finally {
      client.release();
    }
  }
}

runMigrations()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });