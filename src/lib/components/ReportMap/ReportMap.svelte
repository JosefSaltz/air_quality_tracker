<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts" module>
  export type GeoCoords = { latitude: number; longitude: number };
</script>

<script lang="ts">
  import "leaflet/dist/leaflet.css";
  import { onMount} from "svelte";
  import bindMissingAssets from "@/lib/utils/bindMissingAssets";
  import ReportForm from "../Forms/FormTypes/ReportForm/ReportForm.svelte";
  import LoginRequired from "../Dashboard/LoginRequired.svelte";
  import FormDrawer from "../Forms/Layouts/FormDrawer.svelte";
  import generateMarkers from "$lib/utils/generateMarkers"
  import MapSkeleton from "$components/ReportMap/MapSkeleton.svelte";
  import type { PageProps } from "../../../routes/$types";
  import type { Map } from "leaflet";
  import type { User } from "@supabase/supabase-js";

  type Props = {
    markers: PageProps["data"]["markers"],
    form: PageProps["form"]
    user: User | null
  }
  let { 
    markers, 
    user, 
    form 
  }: Props = $props(); 
  let mapDragged = $state(false);
  let lMap: undefined | Map = $state();
  const initialView = {
    latitude: 38.10105120505375,
    longitude: -122.25144198851173
  }
  let currentGeolocation = $state(initialView);
  // Reference assignment for resizing map with viewport
  let container: undefined | Element;
  // CSR logic
  onMount(async () => {
    // Dynamically import the leaflet library to resolve CSR requirements (window global req)
    const L = await import("leaflet");
    // Function to pin needed marker image assets for CSR compatibility
    bindMissingAssets(L);
    // Destructure current geo state values
    const { latitude: x, longitude: y } = currentGeolocation;
    // Initialize the Leaflet map object bound to the element with #map id
    lMap = L.map("map").setView([x, y], 13);
    // Set OpenStreetMap as the tile layer and add to map object
    L
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
      .addTo(lMap);
    // Create the centered selector marker
    const selectionMarker = new L.Marker(lMap.getCenter()).addTo(lMap);
    // Map Event Listeners
    // Update the marker position to center on drag
    lMap.on("move", () => { 
      // Latch the mapDragged state to true
      if(!mapDragged) mapDragged = true;
      // Undefined guard
      const centerCoords = lMap?.getCenter();
      // Set marker coordinate
      centerCoords && selectionMarker.setLatLng(centerCoords); 
    });
    // Update state on end of drag
    lMap.on("moveend", () => { 
      // Destructure
      const { lat, lng } = selectionMarker.getLatLng();
      // Fit values to keys 
      currentGeolocation = { latitude: Number(lat), longitude: Number(lng) }
    });
    // Add all the previously reported markers to the map
    generateMarkers(L, lMap, markers);
    // Set the watermark attribution
    lMap.attributionControl.setPrefix("github.com/JosefSaltz");
    // Clean up function
    return () =>  { lMap && lMap.remove(); }
  });
  // Effect rune to handle resizing of map with viewport
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
      // This might be extraneous
      lMap && lMap.remove();
    }
	})
</script>
<!-- Leafly attachment node -->
<div id="map-container" class="w-full h-full border" >
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