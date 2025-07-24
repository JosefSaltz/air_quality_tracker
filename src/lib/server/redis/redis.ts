import { PRIVATE_REDIS_URL } from '$env/static/private'
import supabase from "$lib/utils/client";
import { createClient } from "redis";
import type { RedisClientOptions } from "redis";
const redisConfig = {
  url: PRIVATE_REDIS_URL
} satisfies RedisClientOptions
;
// Timer assignment for functions to access
let timer: NodeJS.Timeout | undefined;
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
    console.log(`✅ Redis Online!`)
  }
  // Retry once on connection error
  catch(err) {
    console.error(`❌ Something went wrong while trying to connect to Redis`)
    console.warn('⚠️ Retrying Redis connection...')
    if(!secondAttempt) init(true);
    return;
  }
  // Get a copy of reports from the DB
  await cacheReports();
  // Log that the cache is ready
  console.log(`✅ Reports Cache is Ready!`)
}

export async function cacheReports() {
  console.log(`🔁 Storing reports from DB...`);
  // Query DB for the reports table
  const { data, error } = await supabase.from("reports").select("id, created_at, latitude, longitude, description, strength, wind_direction, humidity, precipitation, temperature_f, wind_speed_kn");
  // Log an hour if there was one
  if(error) return console.error(`❌ Redis failed to fetch reports from the DB`, error);
  // Write the queried rows to redis
  try {
    await redisClient.json.set("reports", "$", data);
    console.log('✅ Updated Cache');
  }
  catch(err) {
    console.error(`❌ Redis failed to save reports:`, err);
  }
  // Reset timer incase there is an existing one
  if(timer) clearTimeout(timer);
  // Assign new timeout to refresh the cache periodically
  timer = setTimeout(async () => { await cacheReports() }, 300000)
}

export async function getCachedReports() {
  const data = await redisClient.json.get("reports");
  // Attempt to store reports for next time if no data
  if(!data) await cacheReports();
  if(data) console.log(`💾 Cached Data Retrieved!`);
  return data;
}

init();
