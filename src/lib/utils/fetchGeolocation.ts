import { browser } from "$app/environment";
// src/utils/geolocation.js
export default async function fetchGeolocation(): Promise<{ latitude: number, longitude: number }> {
  const cachedGeo = localStorage.getItem('geolocation')
  if (cachedGeo) {
    console.log(`Found existing cached location`)
    return JSON.parse(cachedGeo);
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn(`Browser does not support geolocation`);
      reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('geolocation', JSON.stringify({ latitude, longitude }))
        resolve({ latitude, longitude });
      },
      (err) => {
        console.error(`Something went wrong while trying to retrieve geolocation`, err)
        reject(err);
      },
      {
        enableHighAccuracy: true, // Use high accuracy if needed
        maximumAge: 60000, // Cache the result for 1 minute
      }
    );
  });
}
