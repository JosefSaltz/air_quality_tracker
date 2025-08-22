type RedisState = {
  redisFailed?: boolean,
  redisOnline?: boolean
}
// Redis Status Flag
let _redisOnline = false;
let _redisFailed = false;
// State Getter
export const getRedisStatus = () => ({ redisOnline: _redisOnline, redisFailed: _redisFailed });
// State Setter
export const setRedisStatus = ({ redisFailed, redisOnline }: RedisState) => { 
  if(typeof redisFailed === "boolean") _redisFailed = redisFailed; 
  if(typeof redisOnline === "boolean") _redisOnline = redisOnline 
} 