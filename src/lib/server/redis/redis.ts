import { PRIVATE_REDIS_URL } from '$env/static/private'
import supabase from "@/lib/utils/client";
import { createClient } from "redis";
import type { RedisClientOptions } from "redis";
const redisConfig = {
  url: PRIVATE_REDIS_URL
} satisfies RedisClientOptions;

const redisClient = createClient(redisConfig);

redisClient.on('error', err => console.error('❌ Redis Error: ', err));

async function init() {
  await storeReports();
}

export async function storeReports() {
  console.log(`Storing reports from DB`)
  // Query DB for the reports table
  const dbReports = await supabase.from("reports").select("id, created_at, latitude, longitude, description, strength, wind_direction, humidity, precipitation, temperature_f, wind_speed_kn");
  const { data } = dbReports;
  if(!data) {
    const { error } = dbReports;
    return console.error(`Something went wrong while retrieving DB reports`, error);
  }
  // Write the queried rows to redis
  try {
    redisClient.json.set("reports", "$", data)
  }
  catch(err) {
    console.error(`Error `);
    return null;
  }
}

export async function getCachedReports() {
  return redisClient.json.get("reports")
}

console.log(`❤️ Redis Connecting...`)
const connection = await redisClient.connect();
if(connection) init();
