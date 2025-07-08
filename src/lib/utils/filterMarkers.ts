import { page } from "$app/state";
import type { PageProps } from "../../routes/$types";
import { Temporal } from '@js-temporal/polyfill';
import Fuse from 'fuse.js';
import { browser } from "$app/environment";
import { isOnAfter, isOnBefore } from "./timeCompare";
import type { TimeOptionKey } from "../constants";
import { parseTimeOperators } from "./parseTimeOperators";

type Markers = PageProps["data"]["markers"];

function filterMarkersByDate(markers: Markers, time: TimeOptionKey = 'Month') { 
  console.log('Filtering By Date');
  // Null Guard
  if(!markers) return markers;
  // Get the before and after query params as CalendarDates from the current URL
  const { before, after } = parseTimeOperators();
  // Returns a filtered marker list between the supplier date range
  const { compare } = Temporal.PlainDate;
  // Return the list filtered inclusively between the after and before dates
  return markers.filter(marker => {
    // Get an instant of the marker's date
    const markerDate = Temporal.PlainDate.from(marker.created_at)
    const isAfter = isOnAfter(compare(markerDate, after));
    const isBefore = isOnBefore(compare(markerDate, before));
    // Return true if markerDate is newer than the oldest allowed time and before now
    return isAfter && isBefore;
  })
}

function filterMarkersByTerm(markers: ReturnType<typeof filterMarkersByDate> | Markers, searchTerm?: string) {
  if(!searchTerm || !markers) return markers;
  const options = {
    keys: ['description', 'strength']
  }
  // Initialize fuse on data set
  const fuse = new Fuse(markers, options);
  return fuse.search(searchTerm).map(result => result.item);
}

export function filterMarkers(markers: Markers, searchTerm?: string | null) {
  // Null guard for now browser or marker data
  if(!browser || !markers) return null;
  // QOL Assign params
  const params = page.url.searchParams;
  // Retrieve potential before and after operators
  const [beforeParam, afterParam, timeParam] = [
    params.get("before"), 
    params.get("after"), 
    params.get('time') as TimeOptionKey | undefined || 'Month'
  ];
  const hasTimeParams = beforeParam && afterParam ? true : false;
  // Assign and return a new reference of the post-processed data
  let markerList: typeof markers | null = markers;
  // Filter by date unless the url time param is set to All
  if(hasTimeParams && timeParam !== 'All') markerList = filterMarkersByDate(markers, timeParam);
  if(searchTerm && markerList) markerList = filterMarkersByTerm(markerList, searchTerm);
  return markerList;
} 