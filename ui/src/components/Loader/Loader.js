// Loader.js

import React from 'react';

const Loader = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000', // Set a high z-index to make sure it's on top
      }}
    >
      {/* Add your loader/spinner component here */}
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
