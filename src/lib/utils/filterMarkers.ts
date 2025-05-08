import { page } from "$app/state";
import type { PageProps } from "../../routes/$types";
import { Temporal } from '@js-temporal/polyfill';
import Fuse from 'fuse.js';
import { browser } from "$app/environment";
import { isOnAfter, isOnBefore } from "./timeCompare";

function filterMarkersByDate(markers: Awaited<PageProps["data"]["markers"]>, days = 30) { 
  // Null Guard
  if(!markers) return markers;
  // Instantiate Temporal Timezone
  const timeZone = Temporal.Now.timeZoneId();
  // Get time for now
  const now = Temporal.Now.zonedDateTimeISO(timeZone);
  // Determine the oldest date from now
  const oldestLimit = now.subtract({ days });
  // Returns a filtered marker list between the supplier date range
  return markers.filter(marker => {
    // Get an instant of the marker's date
    const markerDate = Temporal.Instant.from(marker.created_at).toZonedDateTimeISO(timeZone);
    const isAfter = isOnAfter(Temporal.ZonedDateTime.compare(markerDate, oldestLimit));
    const isBefore = isOnBefore(Temporal.ZonedDateTime.compare(markerDate, now));
    // Return true if markerDate is newer than the oldest allowed time and before now
    return isAfter && isBefore;
  })
}

function filterMarkersByTerm(markers: ReturnType<typeof filterMarkersByDate>, searchTerm?: string) {
  if(!searchTerm || !markers) return markers;
  // Initialize fuse on data set
  const fuse = new Fuse(markers);
  return fuse.search(searchTerm);
}

export async function filterMarkers(markers: PageProps["data"]["markers"], searchTerm?: string | null) {
  if(!browser) return null;
  // Await markers from promise data
  const markerData = await markers;
  type AwaitedMarkers = typeof markerData | ReturnType<typeof filterMarkersByTerm>
  // Null Guard in case no data
  if(!markerData) return null;
  // Retrieve potential before and after operators
  const beforeOp = page.url.searchParams.get("before");
  const afterOp = page.url.searchParams.get("after");
  // Assign and return a new reference of the post-processed data
  let markerList: AwaitedMarkers = markerData;
  if(beforeOp || afterOp) markerList = filterMarkersByDate(markerData);
  if(searchTerm && markerList) markerList = filterMarkersByTerm(markerList, searchTerm)
  return markerList;
} 