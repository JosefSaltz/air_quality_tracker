import { CalendarDate, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
export type DateParams = (string | null) | DateValue
export function retrieveDateParams(url: URL) {
  
  // Get Date Params
  let [ start_date, end_date ]: DateParams[] = [url.searchParams.get('start_date'), url.searchParams.get('end_date')];
  // Handle missing date params to default to 30 days
  if(!start_date || !end_date) {
    console.warn('⚠️ Missing date range query params, setting to default 30 day range')
    const endDate = today(getLocalTimeZone());
    const startDate = endDate.subtract({ days: 30 });
    [start_date, end_date] = [startDate, endDate]
  }
  return { start_date, end_date}
}