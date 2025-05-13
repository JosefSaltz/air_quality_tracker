export function daysBetween(before: string, after: string) {
  const [ beforeDate, afterDate ] = [ new Date(before), new Date(after) ];
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((afterDate.getUTCMilliseconds() - beforeDate.getUTCMilliseconds()) / msPerDay);
}