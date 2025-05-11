<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts" module>
  export type GeoCoords = { latitude: number; longitude: number };
</script>

<script lang="ts">
  import { onMount} from "svelte";
  import bindMissingAssets from "@/lib/utils/bindMissingAssets";
  import ReportForm from "../Forms/ReportForm/ReportForm.svelte";
  import LoginRequired from "../Dashboard/LoginRequired.svelte";
  import FormDrawer from "../Forms/Layouts/FormDrawer.svelte";
  import { createMarker, generateMarkers, } from "$lib/utils/generateMarkers"
  import MapSkeleton from "$components/ReportMap/MapSkeleton.svelte";
  import type { PageProps } from "../../../routes/$types";
  import type { LayerGroup, Map, Marker } from "leaflet";
  import type { User } from "@supabase/supabase-js";
  import MobileMenuButton from "$components/MobileMenu/MobileMenuButton.svelte";
  // import Search from "$components/Search/Search.svelte";
  import { page } from "$app/state";
  import { filterMarkers } from "$lib/utils/filterMarkers";

  // Extrapolated PageProps
  type Props = {
    markers: PageProps["data"]["markers"],
    form: PageProps["form"]
    user: User | null,
    profile: PageProps["data"]["profile"],
    supabase: PageProps["data"]["supabase"]
  }

  let { 
    markers, 
    user, 
    form,
    profile,
    supabase 
  }: Props = $props();

  let mapDragged = $state(false);
  let drawerIsOpen = $state(false);
  let L: undefined | typeof import('leaflet');
  let lMap: undefined | Map = $state();
  let params = $derived(page.url.searchParams);
  let markersToShow = $derived(filterMarkers(markers, params.get('search')));
  let renderedMarkers = $state<LayerGroup | undefined>();
  const initialView = {
    latitude: 38.097557,
    longitude: -122.250036
  };
  let currentGeolocation = $state(initialView);
  // Reference assignment for resizing map with viewport
  let container: undefined | Element;
  $inspect(markersToShow)
  // Encapsulated function to set the map listener events for the selection marker
  function setSelectionMarkerEvents(leafMap: typeof lMap, marker: Marker) {
    if(!leafMap) return;
    // Update the marker position to center on drag
    leafMap.on("move", () => { 
      // Latch the mapDragged state to true
      if(!mapDragged) mapDragged = true;
      // Undefined guard
      const centerCoords = leafMap?.getCenter();
      // Set marker coordinate
      centerCoords && marker.setLatLng(centerCoords); 
    });
    // Update state on end of drag
    leafMap.on("moveend", () => { 
      // Destructure
      const { lat, lng } = marker.getLatLng();
      // Update state
      currentGeolocation = { latitude: Number(lat), longitude: Number(lng) }
    });
  }
  // Client Side Rendering logic
  onMount(async () => {
    // Dynamically import the leaflet library to resolve CSR requirements (window global req)
    L = await import("leaflet");
    const { LocateControl } = await import("leaflet.locatecontrol");
    const locateButton = new LocateControl();
    // Function to bind needed marker image assets for CSR compatibility
    bindMissingAssets(L);
    // Destructure current geo state values
    const { latitude: x, longitude: y } = currentGeolocation;
    // Initialize the Leaflet map object bound to the element with #map id
    lMap = L.map("map").setView([x, y], 15);
    // Set OpenStreetMap as the tile layer and add to map object
    L
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
      .addTo(lMap);
    locateButton.addTo(lMap);
    // Set the watermark attribution
    lMap.attributionControl.setPrefix("github.com/JosefSaltz");
    // Create the centered selector marker
    const selectionMarker = new L.Marker(lMap.getCenter()).addTo(lMap);
    // Map Event Listeners
    setSelectionMarkerEvents(lMap, selectionMarker);
    // Null Guard if the target div hasn't mounted to the DOM yet
    if(!container) return;
    // Invalidate leaflet size on resizes
    const resizeObserver = new ResizeObserver(() => {
      lMap?.invalidateSize();
    });
    // Watch the binded element
    resizeObserver.observe(container);
    renderedMarkers = L.layerGroup().addTo(lMap)
    // Generate markers from the search processed list
    generateMarkers(L, lMap, renderedMarkers, markersToShow);
    // Clean up function
    return () =>  { 
      resizeObserver.disconnect();
      lMap && lMap.remove(); 
    }
  });
  //$inspect(renderedMarkers);
  $effect(() => {
    const [search, before, after] = [params.get('search'), params.get('before'), params.get('after')];
    if(!L || !lMap) return;
    if(search || (before && after)) {
      console.log('Rerunning Search!')
      if(renderedMarkers) renderedMarkers.clearLayers() && 
      generateMarkers(L, lMap, renderedMarkers, markersToShow);
    }
  })
  
  // New marker effect
  $effect(() => {
    // New form generated marker logic
    if(form?.newMarker) {
      // Null guard for global deps
      if(!L || !lMap) return;
      const createdMarker = createMarker(L, form.newMarker);
      createdMarker && createdMarker.addTo(lMap);
    }
  })
</script>
<!-- CDN Tag for Location Button -->
<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.83.1/dist/L.Control.Locate.min.css" />
</svelte:head>
<!-- Leafly attachment node -->
<div id="map-container" class="w-full h-full" >
  <div id="map" bind:this={container} class="w-full h-full z-[1]">
    <!-- <Search id="mobile-search" class="relative z-[99]" /> -->
    <MobileMenuButton class={`lg:hidden flex justify-end relative z-[999]`} user={user} profile={profile} supabase={supabase} />
  </div>
  {#if !lMap}
    <MapSkeleton />
  {/if}
  <FormDrawer user={user} form={form} bind:open={drawerIsOpen} >
    {#if user}
      <ReportForm bind:currentGeolocation bind:drawerIsOpen form={form} />
    {:else}
      <LoginRequired />
    {/if}
  </FormDrawer>
</div>