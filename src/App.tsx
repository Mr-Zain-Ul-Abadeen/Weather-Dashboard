import React, { useState, useEffect } from 'react';
import { Search, Thermometer, Droplets, Wind, CloudRain, Gauge, Sun, Cloud, MapPin, RefreshCw, Compass, Clock, Calendar } from 'lucide-react';
import { WeatherScene } from './components/WeatherScene';
import { CustomCursor } from './components/CustomCursor';
import { ForecastCard } from './components/ForecastCard';
import { ThemeToggle } from './components/ThemeToggle';
import { getWeather, getForecast, getCoordinates } from './services/weatherApi';
import { weatherCodeToDescription, getWeatherEmoji } from './types/weather';
import type { WeatherData, ForecastData } from './types/weather';
import { gsap } from 'gsap';

function App() {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError('');
      const coords = await getCoordinates(city);
      setLocationName(coords.name);
      setTimezone(coords.timezone || 'UTC');
      const [weather, forecast] = await Promise.all([
        getWeather(coords.lat, coords.lon),
        getForecast(coords.lat, coords.lon)
      ]);
      
      gsap.from('.weather-card', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
      });

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const weatherType = weatherData ? weatherCodeToDescription(weatherData.current.weather_code) : 'Clear';
  
  const getLocalTime = () => {
    try {
      return new Date().toLocaleTimeString('en-US', { timeZone: timezone });
    } catch (err) {
      return new Date().toLocaleTimeString('en-US');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden transition-colors duration-500">
      <CustomCursor weatherType={weatherType} />
      <WeatherScene weatherType={weatherType} />
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Weather Dashboard</h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2">
                <Clock className="w-4 h-4" />
                <span>{getLocalTime()}</span>
                <span className="mx-2">•</span>
                <MapPin className="w-4 h-4" />
                <span>{locationName || 'Loading...'}</span>
              </div>
            </div>
            <button
              onClick={fetchWeatherData}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              disabled={refreshing}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search location..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-dark-card/80 backdrop-blur text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-md"
                disabled={loading}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 glass bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {weatherData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="weather-card glass bg-white/80 dark:bg-dark-card/80 rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Current Weather</h2>
                    <p className="text-gray-600 dark:text-gray-300 capitalize">{weatherType}</p>
                  </div>
                  <div className="text-6xl">{getWeatherEmoji(weatherType)}</div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-5xl font-bold gradient-text mb-2">
                      {Math.round(weatherData.current.temperature_2m)}°
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Feels like {Math.round(weatherData.current.apparent_temperature)}°
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">{Math.round(weatherData.current.wind_speed_10m)} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">{Math.round(weatherData.current.relative_humidity_2m)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">UV {weatherData.current.uv_index}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">{weatherData.current.precipitation} mm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">{weatherData.current.pressure_msl} hPa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">{weatherData.current.cloud_cover}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="weather-card glass bg-white/80 dark:bg-dark-card/80 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Location</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                    <p className="text-xl font-semibold gradient-text">{locationName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Timezone</p>
                    <p className="text-gray-700 dark:text-gray-200">{timezone.split('/').join(' / ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cloud Cover</p>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${weatherData.current.cloud_cover}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {forecastData && (
            <div className="weather-card glass bg-white/80 dark:bg-dark-card/80 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">5-Day Forecast</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {forecastData.daily.time.slice(0, 5).map((time, index) => (
                  <ForecastCard
                    key={time}
                    day={new Date(time).toLocaleDateString('en-US', { weekday: 'short' })}
                    temp={forecastData.daily.temperature_2m_max[index]}
                    minTemp={forecastData.daily.temperature_2m_min[index]}
                    weather={weatherCodeToDescription(forecastData.daily.weather_code[index])}
                    precipitation={forecastData.daily.precipitation_probability_max[index]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;