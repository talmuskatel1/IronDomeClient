import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import Sidebar from './SideBar';
import MapComponent from './MapComponent';
import Logo from './Logo';
import theme from './theme';
import { MapCell, Dome } from '../types';

const AppLayout: React.FC = () => {
  const [mapData, setMapData] = useState<MapCell[]>([]);
  const [domes, setDomes] = useState<Dome[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<string>("Not started");

  const handlePlaceDomes = async (count: number) => {
    try {
      const response = await fetch(`http://localhost:3000/map/domes/${count}`, { method: 'POST' });
      const data = await response.json();
      setDomes(data);
      await fetchMapData();
    } catch (error) {
      setError('Failed to place domes. Please try again later.');
    }
  };

  const handleClear = async () => {
    try {
      await fetch('http://localhost:3000/map/reset', { method: 'POST' });
      setDomes([]);
      await fetchMapData();
    } catch (error) {
      setError('Failed to reset map. Please try again later.');
    }
  };

  const handleCellClick = async (cellId: string) => {
    try {
      await fetch(`http://localhost:3000/map/threat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cellId, increase: 0.2 })
      });
      await fetchMapData();
    } catch (error) {
      setError('Failed to update threat level. Please try again later.');
    }
  };

  const fetchMapData = async () => {
    setFetchStatus("Fetching data...");
    try {
      const response = await fetch('http://localhost:3000/map');
      const data = await response.json();
      console.log("Fetched map data:", data);
      setMapData(data);
      setFetchStatus("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching map data:", error);
      setError('Failed to load map data. Please try again later.');
      setFetchStatus("Error fetching data");
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar onPlaceDomes={handlePlaceDomes} onClear={handleClear} />
        <Box component="main" sx={{ 
          flexGrow: 1, 
          position: 'relative', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%'
        }}>
          <Box sx={{ 
            flexGrow: 1, 
            position: 'relative',
            height: '100%',
            width: '100%'
          }}>  
            <MapComponent mapData={mapData} domes={domes} error={error} onCellClick={handleCellClick} loading={false} />
            <Box sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '5px',
              borderRadius: '4px',
            }}>
              <Typography variant="body2">Fetch status: {fetchStatus}</Typography>
              <Typography variant="body2">Map data length: {mapData.length}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;