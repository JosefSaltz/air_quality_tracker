import type { PageProps } from "../../routes/$types";
import { Temporal } from '@js-temporal/polyfill';

export async function filterMarkers(markers: PageProps["data"]["markers"], days = 30) { 
  const markerData = await markers;
  if(!markerData) return null;
  const timeZone = Temporal.Now.timeZoneId();
  // Get time for now
  const now = Temporal.Now.zonedDateTimeISO(timeZone);
  // Determine the oldest date from now
  const oldestLimit = now.subtract({ days });
  // Returns a filtered marker list between the supplier date range
  return markerData.filter(marker => {
    // Get an instant of the marker's date
    const markerDate = Temporal.Instant.from(marker.created_at).toZonedDateTimeISO(timeZone);
    // Return true if markerDate is newer than the oldest allowed time and before now
    return markerDate >= oldestLimit && markerDate <= now;
  })
}