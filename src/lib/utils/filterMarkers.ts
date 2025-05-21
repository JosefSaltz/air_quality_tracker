import { page } from "$app/state";
import type { PageProps } from "../../routes/$types";
import { Temporal } from '@js-temporal/polyfill';
import Fuse, { type FuseResult, type FuseSearchOptions } from 'fuse.js';
import { browser } from "$app/environment";
import { isOnAfter, isOnBefore } from "./timeCompare";
import type { TimeOptionKey } from "../constants";
import { parseTimeOperators } from "./parseTimeOperators";

function filterMarkersByDate(markers: PageProps["data"]["markers"], time: TimeOptionKey = 'Month') { 
  console.log('Filtering By Date');
  // Null Guard
  if(!markers) return markers;
  // Get the before and after query params as CalendarDates from the current URL
  const { before, after } = parseTimeOperators();
  // Returns a filtered marker list between the supplier date range
  const { compare } = Temporal.PlainDate;
  // Filter the list
  return markers.filter(marker => {
    // Get an instant of the marker's date
    const markerDate = Temporal.PlainDate.from(marker.created_at)
    const isAfter = isOnAfter(compare(markerDate, after));
    const isBefore = isOnBefore(compare(markerDate, before));
    // Return true if markerDate is newer than the oldest allowed time and before now
    return isAfter && isBefore;
  })
}

function filterMarkersByTerm(markers: ReturnType<typeof filterMarkersByDate>, searchTerm?: string) {
  console.log('Filtering By Term')
  if(!searchTerm || !markers) return markers;
  const options = {
    keys: ['description', 'strength']
  }
  // Initialize fuse on data set
  const fuse = new Fuse(markers, options);
  return fuse.search(searchTerm).map(result => result.item);
}

export function filterMarkers(markers: PageProps["data"]["markers"], searchTerm?: string | null) {
  console.log('Filtering markers:', markers)
  if(!browser) return null;
  // Null Guard in case no data
  if(!markers) return null;
  // QOL Assign params
  const params = page.url.searchParams;
  // Return all markers if time param is 'All'
  if(params.get('time') === "All") return markers;
  // Retrieve potential before and after operators
  const beforeOp = params.get("before");
  const afterOp = params.get("after");
  const time: TimeOptionKey = params.get('time') as TimeOptionKey | undefined || 'Month';
  // Assign and return a new reference of the post-processed data
  let markerList: typeof markers | null = markers;
  if(beforeOp && afterOp) markerList = filterMarkersByDate(markers, time);
  if(searchTerm && markerList) markerList = filterMarkersByTerm(markerList, searchTerm)
  return markerList;
} 