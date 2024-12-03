<!-- Credit to Github user anzhi0708 for the original implementation -->
<script lang="ts">
  import Skeleton from './ui/skeleton/skeleton.svelte';
  import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import fetchGeolocation from '../utils/fetchGeolocation';

	type GeoCoords = { latitude: number, longitude: number } | null;
	
	let lMap;
	let leaflet;
	let mapLoaded = $state(false);
	let geolocation: GeoCoords = $state(null)
	const setGeolocation = (state: GeoCoords) => { geolocation = state }; 
	
	onMount(async () => {
		try {
			// If we don't already have the geolocation cached update it now
			if(!geolocation) geolocation = await fetchGeolocation();
			
			if(geolocation) {
				console.log(`Loading map...`);
				const { latitude: x, longitude: y } = geolocation;
				// Dynamically import the leaflet library to resolve CSR requirements (window global)
				leaflet = await import("leaflet");
				// Initialize the Leaflet map object
				lMap = leaflet.map("map").setView([x, y], 13);
				leaflet
					.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {})
					.addTo(lMap,);
				lMap.attributionControl.setPrefix("github.com/JosefSaltz");
				console.log('Done!');
			}
		}
		catch(err) {
			console.error(`Something went wrong trying to get the geolocation data`, err);
		}
		finally {
			mapLoaded = true;
		}
  });
</script>

<!-- <Card class="w-[100%]"> -->
	{#if !mapLoaded}
		<Skeleton class="w-full h-full skellyboi" />
	{/if}
	<!-- Leafly attachment node -->
	<div id="map" class="flex-grow-2 w-full border"></div>
<!-- </Card> -->

<style>
	#map {
		border-right: none;
	}
</style>