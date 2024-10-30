import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { MapContainer, TileLayer, Rectangle, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapCell, Dome } from '../types';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  mapData: MapCell[];
  domes: Dome[];
  error: string | null;
  onCellClick: (cellId: string) => void;
  loading: boolean;
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

const MapComponent: React.FC<MapComponentProps> = ({ mapData, domes, error, onCellClick, loading }) => {
  const [viewMode, setViewMode] = useState<'threat' | 'importance'>('threat');

  const getColor = (value: number, mode: 'threat' | 'importance'): string => {
    if (mode === 'threat') {
      const r = Math.min(255, Math.round(value * 255));
      const g = Math.min(255, Math.round((1 - value) * 255));
      return `rgb(${r}, ${g}, 0)`;
    } else {
      const b = Math.min(255, Math.round(value * 255));
      const g = Math.min(255, Math.round(value * 255));
      return `rgb(0, ${g}, ${b})`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        width: '100%',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" align="center">
          מחשב מיקום אופטימלי...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Box sx={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 1000,
        backgroundColor: 'white',
        padding: 1,
        borderRadius: 1
      }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          aria-label="view mode"
          dir="rtl"
        >
          <ToggleButton value="threat" aria-label="threat view">
            איומים
          </ToggleButton>
          <ToggleButton value="importance" aria-label="importance view">
            חשיבות
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <MapContainer
        center={[31.4, 35.0]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?language=he"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
              fillColor: getColor(
                viewMode === 'threat' ? cell.threatLevel : cell.importanceLevel,
                viewMode
              ),
              fillOpacity: 0.4
            }}
            eventHandlers={{
              click: () => onCellClick(cell.id)
            }}
          >
            <Tooltip >
              <div>Threat: {cell.threatLevel.toFixed(2)}</div>
              <div>Imporatnce: {cell.importanceLevel.toFixed(2)}</div>
              <div>Building Density: {cell.buildingDensity.toFixed(2)}</div>
            </Tooltip>
          </Rectangle>
        ))}
        <AnimatedDomes domes={domes} />
      </MapContainer>
    </Box>
  );
};

export default MapComponent;