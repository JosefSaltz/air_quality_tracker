<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts">
  import Skeleton from "../ui/skeleton/skeleton.svelte";
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import fetchGeolocation from "../../utils/fetchGeolocation";
  import type { Map } from "leaflet";

  type GeoCoords = { latitude: number; longitude: number } | null;
  let { markers } = $props(); 
  let container: undefined | Element;
  let leaflet;
  let lMap:  undefined | Map = $state();
  let mapLoaded = $state(false);
  let geolocation: GeoCoords = $state(null);
  const setGeolocation = (state: GeoCoords) => {
    geolocation = state;
  };

  onMount(async () => {
    try {
      // If we don't already have the geolocation cached update it now
      if (!geolocation) geolocation = await fetchGeolocation();

      if (geolocation) {
        console.log(`Loading map...`);
        const { latitude: x, longitude: y } = geolocation;
        // Dynamically import the leaflet library to resolve CSR requirements (window global)
        leaflet = await import("leaflet");
        // Initialize the Leaflet map object bound to the element with #map
        lMap = leaflet.map("map").setView([x, y], 13);
        // Set OpenStreetMap as the tile layer and bind to the node
        leaflet
          .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
          .addTo(lMap);
        // Set the watermark attribution
        lMap.attributionControl.setPrefix("github.com/JosefSaltz");
        console.log("Done!");
      }
    } catch (err) {
      console.error(
        `Something went wrong trying to get the geolocation data`,
        err
      );
    } finally {
      mapLoaded = true;
    }
  });
  
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

<!-- <Card class="w-[100%]"> -->
{#if !lMap}
  <Skeleton class="w-full h-full m-h-[30%] skellyboi" />
{/if}
<!-- Leafly attachment node -->
<div id="map" bind:this={container} class="w-full h-full border"></div>

<!-- </Card> -->

<style>
  #map {
    border-right: none;
  }
</style>
