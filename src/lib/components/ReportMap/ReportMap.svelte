<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts" module>
  export type GeoCoords = { latitude: number; longitude: number };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import fetchGeolocation from "$lib/utils/fetchGeolocation";
  import MapSkeleton from "$components/ReportMap/MapSkeleton.svelte";
  import { dev } from "$app/environment";
  import type { PageProps } from "../../../routes/$types";
  import type { LatLngTuple, Map } from "leaflet";
  import Button from "../ui/button/button.svelte";
  import addCenterMarker from "../Leaflet/leaflet.centermarker";
  
  type Props = {
    markers: PageProps["data"]["markers"],
    currentGeolocation: GeoCoords,
    initialView: GeoCoords
  }
  let { markers, currentGeolocation = $bindable(), initialView }: Props = $props(); 
  let lMap:  undefined | Map = $state();
  let L: typeof import('leaflet') | undefined;
  let container: undefined | Element;

  // Semantic alias
  const devDefault = initialView;
  // Dynamically figure out which location to use in dev mode
  const chooseLocationSource = (retrievedGeo: GeoCoords) => dev ? devDefault : retrievedGeo; 
  // Callback for async getting the current geo data
  const fetchGeoAndUpdate = async () => {
    const coords = await fetchGeolocation();
    // current Geolocation will be initial if in dev mode
    currentGeolocation = chooseLocationSource(coords);
    // Check that lMap exists and then set it's view to the new coords
    lMap && lMap.setView([currentGeolocation.latitude, currentGeolocation.longitude])
  }
  // CSR logic
  onMount(async () => {
    try {
      // Define marker generation
      const generateMarkers = (lMap: Map) => {
        if (!markers) return null;

        return markers.map((marker) => {
          const markerCoords = [ marker.latitude, marker.longitude ] satisfies LatLngTuple;
          if(!L) return console.error('Leaflet is not initialized!')
          L.marker(markerCoords).addTo(lMap);
        })
      }
      // Loading Start
      console.log(`Loading map...`);
      // Async fetch up to date geo coordinates and update the state
      fetchGeoAndUpdate();
      // Destructure current geo values
      const { latitude: x, longitude: y } = currentGeolocation;
      // Dynamically import the leaflet library to resolve CSR requirements (window global)
      L = await import("leaflet");
      // Initialize the Leaflet map object bound to the element with #map
      lMap = L.map("map").setView([x, y], 13);
      // Set OpenStreetMap as the tile layer and add to map object
      L
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
        .addTo(lMap);
      const centerMarkerFactory = addCenterMarker(window);
      const selectMarker = L.centerMarker(lMap);
      selectMark
      console.log(typeof selectMarker);
      selectMarker.on("newposition", () => { const latLang = selectMarker.getLatLng(); console.log(latLang); currentGeolocation = latLang})
      // Add all the markers to the map iteratively
      generateMarkers(lMap);
      // Set the watermark attribution
      lMap.attributionControl.setPrefix("github.com/JosefSaltz");
      // Log Completion
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
<Button class="absolute my-4">Report</Button>
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