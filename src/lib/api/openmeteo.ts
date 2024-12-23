import { OPENMETEO_URL } from "$app/environment"
import { fetchWeatherApi } from "openmeteo";

export async function fetchWind(latitude: FormDataEntryValue, longitude: FormDataEntryValue) {
    const open_meteo_params = { latitude, longitude };
    const fetchWind = await fetchWeatherApi(OPENMETEO_URL, open_meteo_params);
    const { current } = fetchWind[0];
    return current;
}