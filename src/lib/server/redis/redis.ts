import supabase from "@/lib/utils/client";
import { createClient } from "redis";
import type { RedisClientOptions } from "redis";
const redisConfig = {
  url: 'redis://redis@localhost:3888'
} satisfies RedisClientOptions;

const redisClient = createClient(redisConfig);

redisClient.on('error', err => console.error('❌ Redis Error: ', err));

async function init() {
  // Redis Actions
  const hasReports = await getCachedReports();
  if(!hasReports) await storeReports();
}

export async function storeReports() {
  // Query DB for the reports table
  const dbReports = await supabase.from("reports").select();
  const { data } = dbReports;
  if(!data) {
    const { error } = dbReports;
    return console.error(`Something went wrong while retrieving DB reports`, error);
  }
  // Write the queried rows to redis
  try {
    await Promise.all(data.map(async (report) => {
      redisClient.set("reports", JSON.stringify(report))
    }));
  }
  catch(err) {
    console.error(`Error `);
    return null;
  }
}

export async function getCachedReports() {
  return redisClient.get("reports")
}
console.log(`❤️ Redis Connecting...`)
const connection = await redisClient.connect();
if(connection) init();
