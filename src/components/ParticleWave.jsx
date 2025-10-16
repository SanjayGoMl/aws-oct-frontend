import React from 'react';
import Lottie from 'lottie-react';
import particleWaveData from '../animations/Particle wave with depth.json';

const ParticleWave = ({ height = 150, className = '' }) => {
  return (
    <div className={`particle-wave-container ${className}`} style={{ height }}>
      <Lottie 
        animationData={particleWaveData}
        loop={true}
        autoplay={true}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};

export default ParticleWave;