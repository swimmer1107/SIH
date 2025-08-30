import { Coordinates } from '../types';

// --- API KEYS & CONFIGURATION ---

// OpenWeatherMap API Key (for Geocoding)
const OPENWEATHER_API_KEY = 'f7b56a8bbc0c78b92b2146511d35c80a';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

/**
 * Converts a location string into geographic coordinates.
 * @param location A string like "Pune, Maharashtra".
 * @returns A promise resolving to an object with lat and lon.
 */
export const getCoordinates = async (location: string): Promise<Coordinates> => {
    if (!OPENWEATHER_API_KEY) {
        // This error is for the developer, not the user, so no translation needed.
        throw new Error("Location service is not configured (OpenWeather API key missing).");
    }
    const geoResponse = await fetch(`${GEO_API_URL}?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`);
    if (!geoResponse.ok) {
        throw new Error('service.map.geocodeFailed');
    }
    const geoData = await geoResponse.json();
    if (!geoData || geoData.length === 0) {
        throw new Error(`service.map.locationNotFound`);
    }
    const { lat, lon, name, country, state } = geoData[0];
    return { lat, lon, name, country, state };
};