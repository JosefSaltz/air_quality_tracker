import { fetchWeatherApi } from 'openmeteo';
import type { GeoCoords } from '../components/ReportMap/ReportMap.svelte';


export async function fetchMeteoData ({ latitude , longitude }: { latitude: number | null, longitude: number | null}) {
  if(!latitude || !longitude) return console.error('Was not able to fetch Meteo Data from lack of geo data');
  
  const params = {
    latitude,
    longitude,
    "minutely_15": ["temperature_2m", "wind_speed_10m", "wind_direction_10m"],
    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "kn",
    "precipitation_unit": "inch",
    "forecast_days": 1
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
	  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  //const latitude = response.latitude();
  //const longitude = response.longitude();

  const minutely15 = response.minutely15()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {

    minutely15: {
      time: range(Number(minutely15.time()), Number(minutely15.timeEnd()), minutely15.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      temperature2m: minutely15.variables(0)!.valuesArray()!,
      windSpeed10m: minutely15.variables(1)!.valuesArray()!,
      windDirection10m: minutely15.variables(2)!.valuesArray()!,
    },

  };

  // `weatherData` now contains a simple structure with arrays for datetime and weather data
  for (let i = 0; i < weatherData.minutely15.time.length; i++) {
    console.log(
      weatherData.minutely15.time[i].toISOString(),
      weatherData.minutely15.temperature2m[i],
      weatherData.minutely15.windSpeed10m[i],
      weatherData.minutely15.windDirection10m[i]
    );
  }

  return weatherData;
}









