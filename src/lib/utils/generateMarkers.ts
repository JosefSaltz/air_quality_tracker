import type { Map } from "leaflet";
import type { PageProps } from "../../routes/$types";
import type { Tables } from "$root/database.types";

export default function generateMarkers(lMap: Map, markers: PageProps["data"]["markers"]) {
  // Null Guard
  if (!markers) return null;        
  // Iterate through marker data and create a new marker to be placed on the leaflet map
  return markers.map((marker) => {
    // Destructure
    const { latitude, longitude } = marker;
    // Generate pop up content
    const description = constructDescription(marker);
    // Assign formatted coordinates
    const markerCoords = [ latitude, longitude ] satisfies LatLngTuple;
    // Type appeasement
    if(!L) return console.error('Leaflet is not initialized!')
    // 
    const createdMarker = new L.Marker(markerCoords, {
    });
    const markerRef = createdMarker.getElement()
    markerRef && L.DomUtil.addClass(markerRef, "huechange")
    description && createdMarker.bindPopup(description);
    //createdMarker.on("mouseover", (e: MouseEvent) => {})
    createdMarker.addTo(lMap);
  })
}
// Credit: https://gist.github.com/theKAKAN/b40bf54144a6eb90313ad00681e3fbcc
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

function toMPH(knots: number | null) {
  if(!knots) return null;
  const conversionFactor = 1.15078;
  return (knots * conversionFactor).toFixed(2);
}

type QueriedMarker = Omit<Tables<"reports">, "created_by" | "precipitation" | "location"> 
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