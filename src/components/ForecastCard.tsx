import React from 'react';
import { Cloud, Sun, CloudRain, SunSnow as Snow, CloudLightning, Droplets } from 'lucide-react';
import { getWeatherEmoji } from '../types/weather';

interface ForecastCardProps {
  day: string;
  temp: number;
  minTemp: number;
  weather: string;
  precipitation: number;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ day, temp, minTemp, weather, precipitation }) => {
  const getWeatherIcon = () => {
    switch (weather.toLowerCase()) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-500 dark:text-gray-400" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snow':
        return <Snow className="w-8 h-8 text-blue-200" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-purple-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <div className="glass bg-white/60 dark:bg-dark-card/60 rounded-lg p-4 flex flex-col items-center hover:scale-105 transition-all">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{day}</span>
      <div className="weather-icon mb-2">
        {getWeatherIcon()}
      </div>
      <div className="text-2xl font-bold mb-1">
        <span className="gradient-text">{Math.round(temp)}°</span>
      </div>
      <div className="flex items-center gap-1 text-xs mb-2">
        <span className="text-blue-500 dark:text-blue-400">{Math.round(minTemp)}°</span>
        <span className="text-gray-400">|</span>
        <span className="text-red-500 dark:text-red-400">{Math.round(temp)}°</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
        <Droplets className="w-3 h-3 text-blue-500" />
        <span>{precipitation}%</span>
      </div>
    </div>
  );
};