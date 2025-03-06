export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    weather_code: number;
    precipitation: number;
    cloud_cover: number;
    pressure_msl: number;
    uv_index: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
    pressure_msl: string;
  };
}

export interface ForecastData {
  daily: {
    time: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
}

export interface GeocodingData {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    timezone: string;
  }>;
}

export const weatherCodeToDescription = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2 || code === 3) return 'Clouds';
  if (code >= 51 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Clear';
};

export const getWeatherEmoji = (weatherType: string): string => {
  switch (weatherType.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'snow':
      return '❄️';
    case 'thunderstorm':
      return '⚡';
    default:
      return '🌡️';
  }
};