import "server-only";

import { neon } from "@neondatabase/serverless";

let sqlClient: ReturnType<typeof neon> | undefined;

export function getSql() {
  const databaseUrl = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "A Neon connection string is required. Set POSTGRES_URL or DATABASE_URL in the deployment environment.",
    );
  }

  sqlClient ??= neon(databaseUrl);
  return sqlClient;
}
