import markerIconUrl from "$root/node_modules/leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "$root/node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "$root/node_modules/leaflet/dist/images/marker-shadow.png"

export default function mutateLeafletForCSR(L: typeof import('leaflet')) {
  // SSR work around bullshit
    // Credit: https://cescobaz.com/2023/06/14/setup-leaflet-with-svelte-and-vite/
    L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
    L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
    L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
    L.Icon.Default.imagePath = ""; // necessary to avoid Leaflet adds some prefix to image path.
}