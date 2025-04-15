import type { PageProps } from "../../routes/$types";
import { Temporal } from '@js-temporal/polyfill';

export function filterMarkers(markers: Awaited<PageProps["data"]["markers"]>, days: number) { 
  if(!markers) return null;
  // Get time for now
  const now = Temporal.Now.zonedDateTimeISO();
  // Returns a filtered marker list between the supplier date range
  return markers.filter(marker => {
    // Get an instant of the marker's date
    const markerDate = Temporal.Instant.from(marker.created_at);
    // Determine the oldest date from now
    const oldestLimit = now.subtract({ days });
    // Return true if markerDate is newer than the oldest allowed time and before now
    return markerDate >= oldestLimit && markerDate <= now;
  })
}

