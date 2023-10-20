import { Kysely, PostgresDialect } from "kysely";
import { type DB } from "./types";
import { NeonDialect } from "kysely-neon";
import { customAlphabet } from "nanoid";
// import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { Pool } from "pg";

export type { DB } from "./types";

export const db = new Kysely<DB>({
  dialect:
    process.env.NODE_ENV === "production"
      ? new NeonDialect({
          connectionString: process.env.DATABASE_URL,
          webSocketConstructor: ws,
        })
      : new PostgresDialect({
          pool: new Pool({
            connectionString: process.env.DATABASE_URL,
          }),
        }),
});

export const genId = (size?: number) =>
  customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", size ?? 12)();

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
// );
