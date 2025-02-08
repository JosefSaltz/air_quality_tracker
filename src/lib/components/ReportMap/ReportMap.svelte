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
  import type { Tables } from "$root/database.types";
  import ReportForm from "../Forms/FormTypes/ReportForm/ReportForm.svelte";
  import LoginRequired from "../Dashboard/LoginRequired.svelte";
  import type { User } from "@supabase/supabase-js";
  import mutateLeafletForCSR from "@/lib/utils/mutateLeafletForCSR";
  import FormDrawer from "../Forms/Layouts/FormDrawer.svelte";
  import generateMarkers from "$lib/utils/generateMarkers"

  type Props = {
    markers: PageProps["data"]["markers"],
    currentGeolocation: GeoCoords,
    initialView: GeoCoords,
    form: PageProps["form"]
    user: User | null
  }

  let { 
    markers, 
    currentGeolocation = $bindable(), 
    initialView, 
    user, 
    form 
  }: Props = $props(); 
  let mapDragged = $state(false);
  let lMap: undefined | Map = $state();
  let L: undefined | typeof import('leaflet');
  let container: undefined | Element;
  
  // Semantic alias
  const devDefault = initialView;
  // Dynamically figure out which location to use in dev mode
  const chooseLocationSource = (retrievedGeo: GeoCoords) => dev ? devDefault : retrievedGeo; 
  // Callback for async getting the current geo data
  const fetchGeoAndUpdate = async () => {
    const coords = await fetchGeolocation();
    // Short circuit overwriting the position if the user started moving the map at default
    if(mapDragged) return;
    // current Geolocation will be initial if in dev mode
    currentGeolocation = chooseLocationSource(coords);
    // Check that lMap exists and then set it's view to the new coords
    lMap && lMap.setView([currentGeolocation.latitude, currentGeolocation.longitude])
  }
  // CSR logic
  onMount(async () => {
    // Loading Start
    console.log(`Loading map...`);
    // Destructure current geo state values
    const { latitude: x, longitude: y } = currentGeolocation;
    // Dynamically import the leaflet library to resolve CSR requirements (window global req)
    const L = await import("leaflet");
    // Function to pin needed marker image assets for CSR compatibility
    mutateLeafletForCSR(L);
    // Initialize the Leaflet map object bound to the element with #map id
    lMap = L.map("map").setView([x, y], 13);
    // Error logging
    if(!lMap) return console.error(`Something went wrong initializing leafly!`);
    // Grab and update Geo coords logic
    try { 
      navigator.permissions.query({ name: 'geolocation' }).then((permission) => { permission.state !== 'denied' && fetchGeoAndUpdate() })
    }
    catch (err) { 
      console.error(`Something went wrong trying to get the geolocation data`, err); 
    }
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
    });
    // Update state on end of drag
    lMap.on("dragend", () => { 
      // Destructure
      const { lat, lng } = selectorMarker.getLatLng(); 
      // Fit values to keys 
      currentGeolocation = { latitude: Number(lat), longitude: Number(lng) }
    });
    // Add all the previously reported markers to the map
    generateMarkers(lMap, markers);
    // Set the watermark attribution
    lMap.attributionControl.setPrefix("github.com/JosefSaltz");
    // Log Completion
    console.log("Done!");
    // Clean up function
    return () =>  { lMap && lMap.remove(); }
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
				lMap && lMap.remove();
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