import axios from 'axios';
import type { WeatherData, ForecastData, GeocodingData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const getCoordinates = async (city: string): Promise<{ lat: number; lon: number; name: string; timezone: string }> => {
  const response = await axios.get<GeocodingData>(GEOCODING_URL, {
    params: {
      name: city,
      count: 1,
      language: 'en',
      format: 'json'
    }
  });

  if (!response.data.results?.[0]) {
    throw new Error('City not found');
  }

  const { latitude, longitude, name, timezone } = response.data.results[0];
  return { lat: latitude, lon: longitude, name, timezone };
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'wind_speed_10m',
        'weather_code',
        'precipitation',
        'cloud_cover',
        'pressure_msl',
        'uv_index'
      ],
      timezone: 'auto'
    }
  });
  return response.data;
};

export const getForecast = async (lat: number, lon: number): Promise<ForecastData> => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'weather_code',
        'precipitation_probability_max'
      ],
      timezone: 'auto'
    }
  });
  return response.data;
};