import { browser } from "$app/environment";
import { Temporal, Intl, toTemporalInstant } from '@js-temporal/polyfill';
import type { GeoCoords } from "../components/ReportMap/ReportMap.svelte";
// src/utils/geolocation.js
export default async function fetchGeolocation(): Promise<{ latitude: number, longitude: number }> {
  // Catch executions that aren't in the browser
  if(!browser) {
    console.error('Not in a browser environment')
    throw new Error('Geolocation not executed in a server environ')
  }
  // Intialize time
  const now = Temporal.Now.zonedDateTimeISO();
  // Retrive cached coords from local
  const cachedGeo = localStorage.getItem('geolocation');
  // If we have a cached geo and a bad connection
  if (cachedGeo) {
    console.log(`Found existing cached location`)
    const parsedGeo = JSON.parse(cachedGeo);
    const connected = navigator.onLine;
    const expired = parsedGeo.expiry < now.epochMilliseconds;
    if(!expired && !connected) return parsedGeo;
  }
  // Otherwise requery the geolocation data and cache it for 1 min
  return new Promise((resolve, reject) => {
    // Catch browser compatibility errors
    if (!navigator.geolocation) {
      console.warn(`Browser does not support geolocation`);
      reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Add a expiration 5 minutes from now
        const expiry = now.add({'minutes': 5}).epochMilliseconds; 
        // Extrapolate coordinates
        const { latitude, longitude } = position.coords;
        // Save coordinates and expiry to local storage
        localStorage.setItem('geolocation', JSON.stringify({ latitude, longitude, expiry }));
        // Return the latitude and longitude
        resolve({ latitude, longitude });
        console.log('test')
      },
      (err) => {
        console.error(`Something went wrong while requesting geolocation`, err)
        reject(err);
      },
      {
        enableHighAccuracy: true, // Use high accuracy if needed
        maximumAge: 60000, // Cache the result for 1 minute
      }
    );
  });
}
