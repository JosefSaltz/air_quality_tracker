import { page } from "$app/state";
import { Temporal } from '@js-temporal/polyfill';

// Extracts the date from searched before: and after: operators in YYYY-MM-DD format
export const parseTimeOperators = () => {
  // QOL Assign the URL Params
  const params = page.url.searchParams;
  // Assign required parameters
  const [beforeParam, afterParam] = [params.get('before'), params.get('after')];
  // Conditionally assign missing params and default to today if not found
  const after = afterParam ? Temporal.PlainDate.from(afterParam) : Temporal.Now.plainDateISO();
  const before = beforeParam ? Temporal.PlainDate.from(beforeParam) : Temporal.Now.plainDateISO(); 
  return { before, after }
} 

