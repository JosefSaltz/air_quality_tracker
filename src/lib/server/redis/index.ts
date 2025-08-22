import { PRIVATE_REDIS_URL } from '$env/static/private'
import supabase from "$lib/utils/client";
import { createClient } from "redis";
import type { RedisClientOptions, RedisClientType } from "redis";
import { setRedisStatus } from './state';

const redisConfig = {
  url: PRIVATE_REDIS_URL,

} satisfies RedisClientOptions;
// Timer assignment for functions to access
let timer: NodeJS.Timeout | undefined;
let redisClient: ReturnType<typeof createClient> | undefined;
// Attempt Module Level Instantiation of Redis Client 
try {
  redisClient = createClient(redisConfig);
  // Initialize listeners
  redisClient.on("ready", () => { 
    console.log(`✅Redis is ready!`)
    setRedisStatus({ redisFailed: false, redisOnline: true }) 
  });
  redisClient.on("error", (err: Error) => { 
    setRedisStatus({ redisFailed: true, redisOnline: false })
    console.error('❌ Redis Encountered an Error: ', err) 
  });
  redisClient.on("close", () => { 
    console.log(`Redis has ended connection`)
    setRedisStatus({ redisOnline: false })}
  )
}
catch(err) {
  throw new Error('❌ Something went wrong during Redis client creation')
}
// Connects to the client and initalizes the connection and error listeners
async function connectRedis() {
  if(!redisClient) throw new Error('❌ No Redis Client!');
  console.log(`❤️ Redis Connecting...`);
  // Client online check;
  await redisClient.connect();
  console.log(`✅ Redis Online!`);
}
// Start up function to create a connection and store a current copy of reports
export async function initRedis() {
  // Initialize Redis connection
  await connectRedis();
  // Copy reports from the DB to the cache
  await cacheReports();
  // Log that the cache is ready
  console.log(`✅ Redis completed initialization!`);
}
// Retrieves reports table from the DB and stores it in Redis
export async function cacheReports() {
  if(!redisClient) throw new Error('❌ No Redis Client!');
  console.log(`🔁 Storing reports from DB...`);
  // Throw an error if there is no redis client
  // Query DB for the reports table
  const { data, error } = await supabase.from("reports").select("id, created_at, latitude, longitude, description, strength, wind_direction, humidity, precipitation, temperature_f, wind_speed_kn");
  // Log an hour if there was one
  if(error) {
    resetCacheTimer(); 
    return console.error(`❌ Redis failed to fetch reports from the DB`, error);
  }
  // Write the queried rows to redis
  try {
    await redisClient.json.set("reports", "$", data);
    console.log('✅ Updated Cache');
  }
  catch(err) {
    console.error(`❌ Redis failed to save reports:`, err);
  }
  resetCacheTimer();
}
// Util function for clearing the cache timer and restarting it
const resetCacheTimer = () => {
  // Reset timer incase there is an existing one
  if(timer) clearTimeout(timer);
  // Assign new timeout to refresh the cache periodically
  timer = setTimeout(async () => { await cacheReports() }, 300000)
}
// Checks the cache for reports and recaches on null
export async function getCachedReports() {
  if(!redisClient) throw new Error('❌ No Redis Client!');
  const data = await redisClient.json.get("reports");
  // Attempt to store reports for next time if no data
  if(!data) await cacheReports();
  if(data) console.log(`💾 Cached Data Retrieved!`);
  return data;
}