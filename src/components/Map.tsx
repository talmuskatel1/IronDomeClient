import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Rectangle, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapCell, Dome } from '../types';

interface MapProps {
  mapData: MapCell[];
  domes: Dome[];
  error: string | null;
  onCellClick: (cellId: string) => void;
}

const AnimatedDomes: React.FC<{ domes: Dome[] }> = ({ domes }) => {
  const [animatedDomes, setAnimatedDomes] = useState<Dome[]>(domes);
  const map = useMap();

  useEffect(() => {
    const animationDuration = 1000; 
    const startTime = Date.now();

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      const newAnimatedDomes = domes.map((dome) => {
        const prevDome = animatedDomes.find(d => d.id === dome.id) || dome;
        return {
          ...dome,
          coordinate: {
            lat: prevDome.coordinate.lat + (dome.coordinate.lat - prevDome.coordinate.lat) * progress,
            lng: prevDome.coordinate.lng + (dome.coordinate.lng - prevDome.coordinate.lng) * progress,
          },
        };
      });

      setAnimatedDomes(newAnimatedDomes);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [domes, map]);

  return (
    <>
      {animatedDomes.map((dome) => (
        <CircleMarker
          key={dome.id}
          center={[dome.coordinate.lat, dome.coordinate.lng]}
          radius={5}
          pathOptions={{
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.7
          }}
        >
          <Tooltip>Iron Dome {dome.id}</Tooltip>
        </CircleMarker>
      ))}
    </>
  );
};

const Map: React.FC<MapProps> = ({ mapData, domes, error, onCellClick }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (mapData.length > 0) {
      setLoading(false);
    }
  }, [mapData]);

  const getColor = useCallback((threatLevel: number): string => {
    const r = Math.min(255, Math.round(threatLevel * 255));
    const g = Math.min(255, Math.round((1 - threatLevel) * 255));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  if (loading) {
    return <div>Loading map data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <MapContainer
      center={[31.4, 35.0]}
      zoom={8}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapData.map((cell) => (
        <Rectangle
          key={cell.id}
          bounds={[
            [cell.coordinate.lat, cell.coordinate.lng],
            [cell.coordinate.lat + 0.025, cell.coordinate.lng + 0.025]
          ]}
          pathOptions={{
            color: 'transparent',
            weight: 0,
            fillColor: getColor(cell.threatLevel),
            fillOpacity: 0.4
          }}
          eventHandlers={{
            click: () => onCellClick(cell.id)
          }}
        >
          <Tooltip>
            <div>Threat: {cell.threatLevel.toFixed(2)}</div>
            <div>Building Density: {cell.buildingDensity.toFixed(2)}</div>
          </Tooltip>
        </Rectangle>
      ))}
      <AnimatedDomes domes={domes} />
    </MapContainer>
  );
};

export default Map;