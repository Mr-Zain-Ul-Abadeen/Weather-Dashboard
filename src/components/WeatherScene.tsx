import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface WeatherSceneProps {
  weatherType: string;
}

export const WeatherScene = ({ weatherType }: WeatherSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!mountRef.current) return;

  
    const scene = new THREE.Scene();
    sceneRef.current = scene;

  
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

  
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

  
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const getWeatherColor = () => {
      switch (weatherType.toLowerCase()) {
        case 'clear':
          return 0xffdd00;
        case 'clouds':
          return 0x888888;
        case 'rain':
          return 0x4a90e2;
        case 'snow':
          return 0xffffff;
        default:
          return 0x888888;
      }
    };

    const material = new THREE.MeshPhongMaterial({
      color: getWeatherColor(),
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

  
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

  
    gsap.to(sphere.rotation, {
      y: Math.PI * 2,
      duration: 8,
      repeat: -1,
      ease: "none"
    });

    
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

  
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

  
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [weatherType]);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};