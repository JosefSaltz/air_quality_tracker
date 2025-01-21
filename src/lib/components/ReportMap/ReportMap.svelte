<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts" module>
  export type GeoCoords = { latitude: number; longitude: number } | null;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import fetchGeolocation from "$lib/utils/fetchGeolocation";
  import type { Map } from "leaflet";
  import MapSkeleton from "$components/ReportMap/MapSkeleton.svelte";
  import { dev } from "$app/environment";

  let { markers } = $props(); 
  let container: undefined | Element;
  let leaflet;
  let lMap:  undefined | Map = $state();
  const initialView = {
    latitude: 38.10105120505375,
    longitude: -122.25144198851173
  }
  let currentGeolocation: GeoCoords = $state(initialView);
  // Change this to null to query the user's device
  // Binds coordinates to Vallejo, CA absolutely
  // Unsure about how to handle geolocation outside of Vallejo, CA as extraneous data
  
  // Semantic alias
  const devDefault = initialView;


  const fetchGeoAndUpdate = async () => {
    const coords = await fetchGeolocation();
    currentGeolocation = chooseLocationSource(coords);
    lMap && lMap.setView([coords.latitude, coords.longitude])
  }
  const chooseLocationSource = (retrievedGeo: GeoCoords) => dev ? devDefault : retrievedGeo; 

  onMount(async () => {
    try {
      console.log(`Loading map...`);
      // Set a default view of Vallejo
      currentGeolocation = initialView;
      fetchGeoAndUpdate();
      const { latitude: x, longitude: y } = currentGeolocation;
      // Dynamically import the leaflet library to resolve CSR requirements (window global)
      leaflet = await import("leaflet");
      console.log(`loaded leaflet`)
      // Initialize the Leaflet map object bound to the element with #map
      lMap = leaflet.map("map").setView([x, y], 13);
      // Set OpenStreetMap as the tile layer and bind to the node
      leaflet
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
        .addTo(lMap);
      // Set the watermark attribution
      lMap.attributionControl.setPrefix("github.com/JosefSaltz");
      console.log("Done!");
    } catch (err) {
      console.error(
        `Something went wrong trying to get the geolocation data`,
        err
      );
    }
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
<div id="map" bind:this={container} class={`w-full h-full border`}>
  {#if !lMap}
    <MapSkeleton />
  {/if}
</div>
<!-- </Card> -->
<style>
  #map {
    border-right: none;
  }
</style>
