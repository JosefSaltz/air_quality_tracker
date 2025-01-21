<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts" module>
  export type GeoCoords = { latitude: number; longitude: number } | null;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import fetchGeolocation from "$lib/utils/fetchGeolocation";
  import type { LatLngTuple, Map } from "leaflet";
  import MapSkeleton from "$components/ReportMap/MapSkeleton.svelte";
  import { dev } from "$app/environment";
  import type {} from "leaflet"
  import type { Tables } from "$root/database.types";
  let { markers } = $props(); 
  let container: undefined | Element;
  let leaflet: typeof import('leaflet') | undefined;
  let lMap:  undefined | Map = $state();
  const initialView = {
    latitude: 38.10105120505375,
    longitude: -122.25144198851173
  }
  let currentGeolocation = $state(initialView);
  // Change this to null to query the user's device
  // Binds coordinates to Vallejo, CA absolutely
  // Unsure about how to handle geolocation outside of Vallejo, CA as extraneous data
  
  // Semantic alias
  const devDefault = initialView;

  const chooseLocationSource = (retrievedGeo: GeoCoords) => dev ? devDefault : retrievedGeo; 

  const fetchGeoAndUpdate = async () => {
    const coords = await fetchGeolocation();
    // current Geolocation will be initial if in dev mode
    currentGeolocation = chooseLocationSource(coords);
    // Check that lMap exists and then set it's view to the new coords
    lMap && lMap.setView([currentGeolocation.latitude, currentGeolocation.longitude])
  }
  
  

  onMount(async () => {
    try {
      console.log(`Loading map...`);
      // Set a default view of Vallejo
      currentGeolocation = initialView;
      fetchGeoAndUpdate();
      const { latitude: x, longitude: y } = currentGeolocation;
      // Dynamically import the leaflet library to resolve CSR requirements (window global)
      leaflet = await import("leaflet");

      const generateMarkers = (lMap: Map) => {
        markers.forEach((marker: Tables<'reports'>) => {
          const markerCoords = [ marker.latitude, marker.longitude ] satisfies LatLngTuple;
          if(!leaflet) return console.error('Leaflet is now initialized!')
          leaflet.marker(markerCoords).addTo(lMap);
        })
      }
      console.log(`loaded leaflet`)
      // Initialize the Leaflet map object bound to the element with #map
      lMap = leaflet.map("map").setView([x, y], 13);
      // Set OpenStreetMap as the tile layer and bind to the node
      leaflet
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
        .addTo(lMap);
      generateMarkers(lMap);
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
