import type { LayerGroup, Map } from "leaflet";
import type { PageProps } from "../../routes/$types";
import type { Tables } from "$root/database.types";
import type { LatLngTuple } from "leaflet";


type QueriedMarker = Omit<Tables<"reports">, "created_by" | "precipitation" | "location"> 
type LeafLib = typeof import("leaflet");

export function createMarker(L: LeafLib, marker: QueriedMarker) {
  // Type appeasement
  if(!L) return console.error('Leaflet is not initialized!')
  // Destructure
  const { latitude, longitude } = marker;
  // Generate pop up content
  const description = constructDescription(marker);
  // Assign formatted coordinates
  const markerCoords = [ latitude, longitude ] satisfies LatLngTuple;
  // Create a leaflet div icon to render the poop emoji
  const poopIcon = L.divIcon({
    html: '<span style="font-size: 24px;">💩</span>',
    iconSize: [32, 32], // adjust size as needed
    className: 'custom-poop-icon', // you can style this further via CSS if desired
  });
  // Return a new instantiated marker 
  const createdMarker = new L.Marker(markerCoords, { icon: poopIcon });
  // Add the record's description to the marker's pop-up
  description && createdMarker.bindPopup(description);
  // Return the completed marker with it's created pop-up
  return createdMarker;
}

export async function generateMarkers(L: LeafLib, lMap: Map, layerGroup: LayerGroup, markers: PageProps["data"]["markers"] | Awaited<PageProps["data"]["markers"]>) {    
  // Handle if the markers are in promise form
  const receivedData = (markers instanceof Promise) ? await markers : markers;
  if(!receivedData) return;
  // Iterate through marker data and create a new marker to be placed on the leaflet map
  return receivedData.map((marker) => {
    const createdMarker = createMarker(L, marker);
    if(!createdMarker) return console.error(`Failed to create marker`);
    createdMarker.addTo(layerGroup)
    createdMarker.addTo(lMap);
  });
}
// Credit: https://gist.github.com/theKAKAN/b40bf54144a6eb90313ad00681e3fbcc
function toMPH(knots: number | null) {
  if(!knots) return null;
  const conversionFactor = 1.15078;
  return (knots * conversionFactor).toFixed(2);
}

function getDirection( angle: number | null ) {
  if(!angle) return null;
  let directions: string[] = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ]
  const section: number = Math.floor(angle / 22.5 + 0.5)
  return directions[ section % 16 ]
}

function constructDescription(marker: QueriedMarker) {
  const { created_at, humidity, description, strength, temperature_f, wind_direction, wind_speed_kn } = marker;
  const dateTime = new Date(created_at);
  const localeString = dateTime.toLocaleString("en-US", { "timeStyle": "short", "dateStyle": "medium" })
  const cardinal_dir = getDirection(wind_direction);
  const wind_mph = toMPH(wind_speed_kn);
  return `
    <strong>Strength:</strong> ${strength}<br />
    <strong>Wind Direction:</strong> ${ cardinal_dir} (${wind_direction?.toFixed(0)}deg)<br />
    <strong>Wind Speed:</strong> ${wind_speed_kn?.toFixed(2)}kn (${wind_mph}mph)<br />
    <strong>Temperature:</strong> ${temperature_f?.toFixed(0)}F<br />
    <strong>Humidity:</strong> ${humidity}%<br />
    <strong>Time:</strong> ${localeString}<br />
    <strong>Description:</strong> ${description}<br />
  `;
}