import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { DATABASE_URL, LOCAL_DATABASE_URL } from "$env/static/private";

console.log(`env:`, import.meta.env.PROD);
const db_url = import.meta.env.PROD ? DATABASE_URL : LOCAL_DATABASE_URL;
const client = postgres(db_url);
export const db = drizzle(client, { schema });
