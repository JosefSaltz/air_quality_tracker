<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts" module>
  export type GeoCoords = { latitude: number; longitude: number };
</script>

<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import "leaflet/dist/leaflet.css";
  import fetchGeolocation from "$lib/utils/fetchGeolocation";
  import MapSkeleton from "$components/ReportMap/MapSkeleton.svelte";
  import { dev } from "$app/environment";
  import type { PageProps } from "../../../routes/$types";
  import type { LatLngTuple, Map } from "leaflet";
  import { Button, buttonVariants } from "../ui/button";
  import type { Tables } from "$root/database.types";
  import ReportForm from "../Forms/FormTypes/ReportForm/ReportForm.svelte";
  import LoginRequired from "../Dashboard/LoginRequired.svelte";
  import type { User } from "@supabase/supabase-js";
  import * as Drawer from "../ui/drawer";
  import FormDrawer from "../Forms/Layouts/FormDrawer.svelte";
  import markerIconUrl from "$root/node_modules/leaflet/dist/images/marker-icon.png";
  import markerIconRetinaUrl from "$root/node_modules/leaflet/dist/images/marker-icon-2x.png";
  import markerShadowUrl from "$root/node_modules/leaflet/dist/images/marker-shadow.png";

  type Props = {
    markers: PageProps["data"]["markers"],
    currentGeolocation: GeoCoords,
    initialView: GeoCoords,
    form: PageProps["form"]
    user: User | null
  }
  type QueriedMarker = Omit<Tables<"reports">, "created_by" | "precipitation" | "location"> 

  let { markers, currentGeolocation = $bindable(), initialView, user, form }: Props = $props(); 
  let lMap:  undefined | Map = $state();
  let L: typeof import('leaflet') | undefined;
  let container: undefined | Element;
  let mapDragged = $state(false);
  // Semantic alias
  const devDefault = initialView;
  // Dynamically figure out which location to use in dev mode
  const chooseLocationSource = (retrievedGeo: GeoCoords) => dev ? devDefault : retrievedGeo; 
  // Callback for async getting the current geo data
  const fetchGeoAndUpdate = async () => {
    const coords = await fetchGeolocation();
    if(mapDragged) return;
    // current Geolocation will be initial if in dev mode
    currentGeolocation = chooseLocationSource(coords);
    // Check that lMap exists and then set it's view to the new coords
    lMap && lMap.setView([currentGeolocation.latitude, currentGeolocation.longitude])
  }
  // CSR logic
  onMount(async () => {
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
    // Define marker generation
    function generateMarkers(lMap: Map) {
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
    // Grab and update Geo coords
    try { fetchGeoAndUpdate() }
    catch (err) { console.error(`Something went wrong trying to get the geolocation data`, err); }
    // Loading Start
    console.log(`Loading map...`);
    // Destructure current geo state values
    const { latitude: x, longitude: y } = currentGeolocation;
    // Dynamically import the leaflet library to resolve CSR requirements (window global req)
    const L = await import("leaflet");
    // SSR work around bullshit
    // Credit: https://cescobaz.com/2023/06/14/setup-leaflet-with-svelte-and-vite/
    L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
    L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
    L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
    L.Icon.Default.imagePath = ""; // necessary to avoid Leaflet adds some prefix to image path.
    // Initialize the Leaflet map object bound to the element with #map id
    lMap = L.map("map").setView([x, y], 13);
    if(!lMap) return console.error(`Something went wrong initializing leafly!`);
    // Set OpenStreetMap as the tile layer and add to map object
    L
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
      .addTo(lMap);
    // Create the centered selector marker
    const selectorMarker = new L.Marker(lMap.getCenter()).addTo(lMap);
    // Map Event Listeners
    // Update the marker position to center on drag
    lMap.on("drag", () => { 
    // Latch the mapDragged state to true
    if(!mapDragged) mapDragged = true;
    // Undefined guard
    const centerCoords = lMap?.getCenter();
    // Set marker coordinate
    centerCoords && selectorMarker.setLatLng(centerCoords); 
  })
    // Update state on end of drag
    lMap.on("dragend", () => { 
      // Destructure
      const { lat, lng } = selectorMarker.getLatLng(); 
      // Fit values to keys 
      currentGeolocation = { latitude: Number(lat), longitude: Number(lng)}
    });
    // Add all the previously reported markers to the map
    generateMarkers(lMap);
    // Set the watermark attribution
    lMap.attributionControl.setPrefix("github.com/JosefSaltz");
    // Log Completion
    console.log("Done!"); 
  });
  // Effect to handle dynamic resizing
  $effect(() => {
      // Null Guard
			if(!container) return;
			// Invalidate leaflet size on resizes
			const resizeObserver = new ResizeObserver(() => {
				lMap?.invalidateSize();
			})
			// Watch the binded element
			resizeObserver.observe(container);
			// Clean up function
			return () => {
				resizeObserver.disconnect();
				lMap?.remove();
			}
		})
</script>
<!-- Leafly attachment node -->
<div id="map-container" class=" w-full h-full border" >
  <div id="map" bind:this={container} class={`w-full h-full absolute z-0`}></div>
  {#if !lMap}
    <MapSkeleton />
  {/if}
  <FormDrawer user={user} form={form}>
    {#if user}
      <ReportForm bind:currentGeolocation form={form} />
    {:else}
      <LoginRequired />
    {/if}
  </FormDrawer>
</div>

<style>
  #map {
    border-right: none;
  }
  .huechange { filter: hue-rotate(120deg); }
</style>