import React from 'react';

const ColorBar: React.FC = () => {
  return (
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Building Density</h4>
      <div style={{ display: 'flex', alignItems: 'center', height: '20px', width: '200px' }}>
        <div style={{ flex: 1, height: '100%', background: 'linear-gradient(to right, rgb(255,255,0), rgb(255,0,0))' }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default ColorBar;