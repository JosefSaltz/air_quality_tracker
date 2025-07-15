import { PRIVATE_REDIS_URL } from '$env/static/private'
import supabase from "$lib/utils/client";
import { createClient } from "redis";
import type { RedisClientOptions } from "redis";
const redisConfig = {
  url: PRIVATE_REDIS_URL
} satisfies RedisClientOptions;
// Create redis client instance from config
const redisClient = createClient(redisConfig);
// Establish error handler logging
redisClient.on('error', err => console.error('❌ Redis Error: ', err));
// Start up function to create a connection and store a current copy of reports
async function init(secondAttempt = false) {
  // Attempt a connection to Redis
  console.log(`❤️ Redis Connecting...`);
  try {
    await redisClient.connect();
  }
  // Retry once on connection error
  catch(err) {
    console.error(`❌ Something went wrong while trying to connect to Redis`)
    console.warn('⚠️ Retrying Redis connection...')
    if(!secondAttempt) init(true);
    return;
  }
  // Log success
  console.log(`✅ Redis Connected!`);
  // Get a copy of reports from the DB
  await storeReports();
  // Log that the cache is ready
  console.log(`✅ Reports Cache is Ready!`)
}

export async function storeReports() {
  console.log(`🔁 Storing reports from DB...`);
  // Query DB for the reports table
  const { data, error } = await supabase.from("reports").select("id, created_at, latitude, longitude, description, strength, wind_direction, humidity, precipitation, temperature_f, wind_speed_kn");
  // Log an hour if there was one
  if(error) return console.error(`❌ Redis failed to fetch reports from the DB`, error);
  // Write the queried rows to redis
  try {
    redisClient.json.set("reports", "$", data);
  }
  catch(err) {
    console.error(`❌ Redis failed to save reports`, err);
  }
  console.log('💾 Updated Reports')
}

export async function getCachedReports() {
  return redisClient.json.get("reports")
}

init();
