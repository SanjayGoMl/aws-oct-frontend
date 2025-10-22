import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WaveAnimation = () => {
  const waveRef = useRef(null);

  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;

    // Create SVG wave paths
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 1200 120');
    svg.setAttribute('preserveAspectRatio', 'none');

    const defs = document.createElementNS(svgNS, 'defs');
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', 'waveGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');

    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'rgba(255,255,255,0.3)');

    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'rgba(255,255,255,0.1)');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const path1 = document.createElementNS(svgNS, 'path');
    path1.setAttribute('fill', 'url(#waveGradient)');
    path1.setAttribute('opacity', '0.8');

    const path2 = document.createElementNS(svgNS, 'path');
    path2.setAttribute('fill', 'rgba(255,255,255,0.2)');
    path2.setAttribute('opacity', '0.6');

    svg.appendChild(path1);
    svg.appendChild(path2);
    wave.appendChild(svg);

    // Animate waves
    const timeline = gsap.timeline({ repeat: -1 });

    timeline.to(path1, {
      duration: 4,
      attr: {
        d: 'M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z'
      },
      ease: 'sine.inOut'
    }).to(path1, {
      duration: 4,
      attr: {
        d: 'M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z'
      },
      ease: 'sine.inOut'
    });

    timeline.to(path2, {
      duration: 3,
      attr: {
        d: 'M0,80 Q300,40 600,80 T1200,80 L1200,120 L0,120 Z'
      },
      ease: 'sine.inOut'
    }, 0).to(path2, {
      duration: 3,
      attr: {
        d: 'M0,50 Q300,90 600,50 T1200,50 L1200,120 L0,120 Z'
      },
      ease: 'sine.inOut'
    });

    // Initial paths
    gsap.set(path1, {
      attr: {
        d: 'M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z'
      }
    });

    gsap.set(path2, {
      attr: {
        d: 'M0,50 Q300,90 600,50 T1200,50 L1200,120 L0,120 Z'
      }
    });

    return () => {
      timeline.kill();
    };
  }, []);

  return <div ref={waveRef} className="wave-container"></div>;
};

export default WaveAnimation;