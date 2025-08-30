import { WeatherData } from '../types';

// IMPORTANT: You must create an environment variable called OPENWEATHER_API_KEY
// with your API key from OpenWeatherMap.
const API_KEY = 'f7b56a8bbc0c78b92b2146511d35c80a';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Function to map OpenWeatherMap icon codes to emojis
const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅️', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌦️', '09n': '🌦️',
    '10d': '🌧️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[iconCode] || '-';
};

export const getWeatherForecast = async (location: string): Promise<WeatherData[]> => {
  if (!API_KEY) {
    console.error("OpenWeatherMap API key not set in environment variables (OPENWEATHER_API_KEY).");
    throw new Error("Weather service is not configured. An API key is required.");
  }

  try {
    // 1. Geocode location to get lat/lon
    const geoResponse = await fetch(`${GEO_API_URL}?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`);
    if (!geoResponse.ok) {
      throw new Error('Failed to geocode location. Please check the location name.');
    }
    const geoData = await geoResponse.json();
    if (!geoData || geoData.length === 0) {
      throw new Error(`Could not find location: ${location}`);
    }
    const { lat, lon } = geoData[0];

    // 2. Fetch 5-day weather forecast
    const weatherResponse = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data from the weather service.');
    }
    const weatherData = await weatherResponse.json();

    // 3. Process the data to get one forecast per day
    const dailyForecasts: { [key: string]: any } = {};

    for (const item of weatherData.list) {
      const forecastDate = new Date(item.dt * 1000);
      const dayKey = forecastDate.toISOString().split('T')[0]; // YYYY-MM-DD

      // Prioritize the forecast around noon, but store the first one if noon is not available
      if (!dailyForecasts[dayKey] || (forecastDate.getHours() >= 11 && forecastDate.getHours() <= 13)) {
        dailyForecasts[dayKey] = item;
      }
    }
    
    const sortedDays = Object.keys(dailyForecasts).sort();
    
    const finalForecasts: WeatherData[] = sortedDays.slice(0, 5).map((dayKey, index) => {
      const item = dailyForecasts[dayKey];
      let dayLabel = `+${index} Days`;
      if (index === 0) dayLabel = 'Today';
      if (index === 1) dayLabel = 'Tomorrow';

      return {
        day: dayLabel,
        temp: `${Math.round(item.main.temp)}°C`,
        icon: getWeatherIcon(item.weather[0].icon),
        condition: item.weather[0].main,
      };
    });

    return finalForecasts;

  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    if (error instanceof Error) {
        throw new Error(`Weather service failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching weather data.");
  }
};