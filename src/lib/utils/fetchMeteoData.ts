import { fetchWeatherApi } from 'openmeteo';

export async function fetchMeteoData ({ latitude , longitude }: { latitude: number | null, longitude: number | null}) {
  if(!latitude || !longitude) return console.error('Was not able to fetch Meteo Data from lack of geo data');
  
  const params = {
    latitude,
    longitude,
    "current": ["temperature_2m", "relative_humidity_2m", "precipitation", "wind_speed_10m", "wind_direction_10m"],
    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "kn",
    "precipitation_unit": "inch",
    "forecast_days": 1,
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
  const current = response.current()!;
  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      relativeHumidity2m: current.variables(1)!.value(),
      precipitation: current.variables(2)!.value(),
      windSpeed10m: current.variables(3)!.value(),
      windDirection10m: current.variables(4)!.value(),
    }
  };

  return weatherData;
}