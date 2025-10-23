import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const LottieCarousel = ({ animations, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedAnimations, setLoadedAnimations] = useState([]);

  // Load animations from public directory
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const loadedAnims = await Promise.all(
          animations.map(async (animPath) => {
            const response = await fetch(animPath);
            return await response.json();
          })
        );
        setLoadedAnimations(loadedAnims);
      } catch (error) {
        console.error('Error loading animations:', error);
      }
    };

    if (animations && animations.length > 0) {
      loadAnimations();
    }
  }, [animations]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || loadedAnimations.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedAnimations.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, loadedAnimations.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!loadedAnimations || loadedAnimations.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        Loading animations...
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      {/* Main Lottie Animation */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        maxWidth: '500px' 
      }}>
        <div style={{ width: '100%', height: '100%', maxHeight: '400px' }}>
          <Lottie 
            animationData={loadedAnimations[currentIndex]} 
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Dots Indicator */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '8px',
        padding: '20px 0',
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        {loadedAnimations.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: index === currentIndex 
                ? 'rgba(255, 255, 255, 1)' 
                : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LottieCarousel;
