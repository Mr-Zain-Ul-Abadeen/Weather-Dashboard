import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface CustomCursorProps {
  weatherType: string;
}

export const CustomCursor = ({ weatherType }: CustomCursorProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  useEffect(() => {
    gsap.to('.cursor', {
      duration: 0.5,
      x: position.x,
      y: position.y,
      ease: "power2.out"
    });
  }, [position]);

  const getCursorContent = () => {
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

  return (
    <div
      className="cursor fixed pointer-events-none z-50 text-2xl transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: 0, top: 0 }}
    >
      {getCursorContent()}
    </div>
  );
};