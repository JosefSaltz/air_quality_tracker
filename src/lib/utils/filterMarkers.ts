import { page } from "$app/state";
import { marker } from "leaflet";
import type { PageProps } from "../../routes/$types";
import { Temporal } from '@js-temporal/polyfill';
import Fuse from 'fuse.js';

type MarkersList = Awaited<PageProps["data"]["markers"]>
type FilteredResults = ReturnType<typeof filterMarkersByDate | typeof filterMarkersByTerm>

function filterMarkersByDate(markers: MarkersList, days = 30) { 
  if(!markers) return null;
  const timeZone = Temporal.Now.timeZoneId();
  // Get time for now
  const now = Temporal.Now.zonedDateTimeISO(timeZone);
  // Determine the oldest date from now
  const oldestLimit = now.subtract({ days });
  // Returns a filtered marker list between the supplier date range
  return markers.filter(marker => {
    // Get an instant of the marker's date
    const markerDate = Temporal.Instant.from(marker.created_at).toZonedDateTimeISO(timeZone);
    // Return true if markerDate is newer than the oldest allowed time and before now
    return markerDate >= oldestLimit && markerDate <= now;
  })
}

function filterMarkersByTerm(markers: ReturnType<typeof filterMarkersByDate>, searchTerm?: string) {
  // Null Guards
  if(!markers) return [];
  if(!searchTerm) return markers;
  // Initialize fuse on data set
  const fuse = new Fuse(markers);
  return fuse.search(searchTerm);
}

export async function filterMarkers(markers: PageProps["data"]["markers"], searchTerm?: string) {
  // Await markers from promise data
  const markerData = await markers;
  // Null Guard in case no data
  if(!markerData) return null;
  // Retrieve potential before and after operators
  const beforeOp = page.url.searchParams.get("before");
  const afterOp = page.url.searchParams.get("after");
  let markerList = markerData;
  if(beforeOp || afterOp) markerList = filterMarkersByDate(markerData) 
  if(searchTerm && markerList) markerList = filterMarkersByTerm(markerList, searchTerm)
  return markerList;
} 