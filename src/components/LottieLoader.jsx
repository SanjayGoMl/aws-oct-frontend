import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import loadingData from '../animations/Loading.json';

const LottieLoader = ({ 
  size = 60, 
  text = "Loading...", 
  subtitle = "Taking some time...",
  className = '',
  showText = true,
  showSubtitle = true
}) => {
  return (
    <motion.div 
      className={`loading ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        style={{ 
          width: size, 
          height: size,
          marginBottom: showText ? '1rem' : 0
        }}
      >
        <Lottie 
          animationData={loadingData}
          loop={true}
          autoplay={true}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </motion.div>
      
      {showText && (
        <motion.span 
          className="loading-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ 
            fontSize: '1.125rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          {text}
        </motion.span>
      )}
      
      {showSubtitle && (
        <motion.div 
          className="loading-subtitle"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {subtitle}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LottieLoader;