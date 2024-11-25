import React, { useState } from 'react';
import { Drawer, Typography, TextField, Button, Box, useTheme } from '@mui/material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
interface SidebarProps {
  onPlaceDomes: (count: number) => void;
  onClear: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ onPlaceDomes, onClear }) => {
    const theme = useTheme();
    const [domeCount, setDomeCount] = useState(10);
    const navigate = useNavigate();
  
    const handlePlaceDomes = () => {
      onPlaceDomes(domeCount);
    };
    const handleSignOut = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };
  
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ padding: theme.spacing(2) }}>
          <Logo />  
          <Typography variant="h6" gutterBottom color="primary">
            Iron Dome Placement
          </Typography>
          <TextField
            label="Number of Domes"
            type="number"
            value={domeCount}
            onChange={(e) => setDomeCount(Math.max(1, parseInt(e.target.value, 10)))}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            startIcon={<AddLocationIcon />}
            onClick={handlePlaceDomes}
            fullWidth
            sx={{ mt: 2 }}
          >
            Place Domes
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClear}
            fullWidth
            sx={{ mt: 2 }}
          >
            Clear
          </Button>
          <Button 
  onClick={handleSignOut}
  sx={{ 
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'white',
    backgroundColor: '#d32f2f',
    '&:hover': {
      backgroundColor: '#b71c1c',
    }
  }}
>
  Sign Out
</Button>
        </Box>
      </Drawer>
    );
  };
  
  export default Sidebar;