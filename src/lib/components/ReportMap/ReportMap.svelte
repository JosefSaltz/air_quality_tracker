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
  import { createMarker, generateMarkers } from "$lib/utils/generateMarkers"
  import MapSkeleton from "$components/ReportMap/MapSkeleton.svelte";
  import type { PageProps } from "../../../routes/$types";
  import type { LayerGroup, Map, Marker, MarkerClusterGroup } from "leaflet";
  import type { User } from "@supabase/supabase-js";
  import MobileMenuButton from "@/lib/components/HamburgerMenu/HamburgerMenuButton.svelte";
  import Search from "$components/Search/Search.svelte";
  import TimeSelect from "$components/Search/TimeSelect.svelte";
  // import Search from "$components/Search/Search.svelte";
  import { page } from "$app/state";
  import { filterMarkers } from "$lib/utils/filterMarkers";
  import { innerWidth } from "svelte/reactivity/window";
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
  
  let currentSearch = $state(page.url.searchParams.get('search'));
  let currentBefore = $state(page.url.searchParams.get('before'));
  let currentAfter = $state(page.url.searchParams.get('after'));
  let currentTime = $state(page.url.searchParams.get('time'));
  let markersToShow = $state(filterMarkers(markers, params.get('search')));
  let existingMarkerLayer = $state<LayerGroup | undefined>();
  const initialView = {
    latitude: 38.097557,
    longitude: -122.250036
  };
  let currentGeolocation = $state(initialView);
  // Reference assignment for resizing map with viewport
  let container: undefined | Element;

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
  // Client side Leaflet set up and configuration
  onMount(async () => {
    // Dynamically import the leaflet library to resolve CSR requirements (window global req)
    L = await import("leaflet");
    // Ensure the import and window global are in sync
    window.L = L;
    // Add in the markercluster plugin that patches itself to the window global
    await import("leaflet.markercluster");
    // Destructure LocateControl constructor from plugin
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
    existingMarkerLayer = L.markerClusterGroup().addTo(lMap)
    // Generate markers from the search processed list
    generateMarkers(L, lMap, existingMarkerLayer, markersToShow);
    // Clean up function
    return () =>  { 
      resizeObserver.disconnect();
      lMap && lMap.remove(); 
    }
  });
  // Param change effect
  $effect(() => {
    const [search, before, after, time] = [params.get('search'), params.get('before'), params.get('after'), params.get('time')];
    // Null guard against leaflet map intializiation
    if(!L || !lMap) return;
    // If there's a search term or date range in the URL
    if(search || (before && after)) {
      // Check if current params mismatch current state
      if(search !== currentSearch || before !== currentBefore || after !== currentAfter || time !== currentTime) {
        console.log('Rerunning Search!')
        // Clear out currently existingMarkerLayer
        const refilteredMarkers = filterMarkers(markers, params.get('search'));
        if(existingMarkerLayer) {
          // Clear existing markers out of the marker layer
          existingMarkerLayer.clearLayers();
          // Regenerate and attach the markers with the filteredMarkers 
          generateMarkers(L, lMap, existingMarkerLayer, refilteredMarkers);  
        }
        markersToShow = refilteredMarkers;
        // Update mismatched state params
        if(search !== currentSearch) currentSearch = search;
        if(before !== currentBefore) currentBefore = before;
        if(after !== currentAfter) currentAfter = after;
        if(time !== currentTime) currentTime = time;
      }
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
<!-- CDN Tag for Leaflet Plugin Stylesheets -->
<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.83.1/dist/L.Control.Locate.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
</svelte:head>
<!-- Leafly attachment node -->
<div id="map-container" class="w-full h-full" >
  <div id="map" bind:this={container} class="w-full h-full z-[1]">
    {#if innerWidth?.current && innerWidth?.current <= 768}
    <div class="flex justify-center w-full">
      <div id="mobile-search-container" class={`w-full flex flex-col-reverse md:hidden relative z-[500] pl-16 pr-4 pt-4`}>
        <TimeSelect class="relative z-[20]" />
        <Search class="w-full max-w-[80ch]" />  
      </div>
      <MobileMenuButton class={`md:hidden relative z-[500] aspect-square pt-4`} user={user} profile={profile} supabase={supabase} />
    </div>
    {/if}
    
    <FormDrawer user={user} form={form} bind:open={drawerIsOpen} >
      {#if user}
        <ReportForm bind:currentGeolocation bind:drawerIsOpen form={form} />
      {:else}
        <LoginRequired />
      {/if}
    </FormDrawer>
  </div>
  {#if !lMap}
    <MapSkeleton />
  {/if}
  
</div>