import React from 'react';
import { Avatar, Box } from '@mui/material';
import logoSrc from '../assets/logo.webp';

const Logo: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
    <Avatar
      src={logoSrc}
      alt="Iron Dome Optimizer Logo"
      sx={{
        width: 60,
        height: 60,
        border: '2px solid',
        borderColor: 'primary.main'
      }}
    />
  </Box>
);
};

export default Logo;