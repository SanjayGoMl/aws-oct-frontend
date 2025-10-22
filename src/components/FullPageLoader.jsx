import React from 'react';
import { motion } from 'framer-motion';
import LottieLoader from './LottieLoader';

const FullPageLoader = ({ isVisible, text = "Processing...", subtitle = "Please wait..." }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Reduced opacity to show page underneath
        backdropFilter: 'blur(4px)', // Reduced blur to show content
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        pointerEvents: 'all', // Prevent clicks through the overlay
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '3rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(30, 58, 138, 0.1)',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <LottieLoader 
          size={120}
          text={text}
          subtitle={subtitle}
          showText={true}
          showSubtitle={true}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: 'rgba(30, 58, 138, 0.7)',
            lineHeight: 1.5,
          }}
        >
          This may take a few minutes for large files...
        </motion.div>

        {/* Animated progress indicator */}
        <motion.div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(30, 58, 138, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '1rem',
          }}
        >
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              borderRadius: '2px',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FullPageLoader;