import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SpiderWeb from '../atoms/SpiderWeb';
import Spider from '../atoms/Spider';

export default function ScrollSpider() {
  const [spiderY, setSpiderY] = useState(70);

  useEffect(() => {
    let ticking = false;

    const updateSpiderPosition = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollY / scrollHeight)) : 0;

      // Calculate where the spider should appear in viewport space
      const isMobile = window.innerWidth < 600;
      const startScreenY = isMobile ? 80 : 100;
      const maxScreenY = window.innerHeight - (isMobile ? 90 : 120);

      // Target position on screen
      const currentScreenY = startScreenY + progress * (maxScreenY - startScreenY);

      // AboutMe section offset relative to the document
      const aboutMeEl = document.getElementById('sobre-mi');
      const aboutMeOffsetTop = aboutMeEl ? aboutMeEl.offsetTop : 70;

      // Absolute Y position inside the AboutMe section
      const absY = scrollY + currentScreenY - aboutMeOffsetTop;
      setSpiderY(Math.max(50, absY));

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateSpiderPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateSpiderPosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      {/* 1. Telaraña en la esquina superior izquierda */}
      <SpiderWeb />

      {/* 2. Hilo de seda y araña descendente */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: { xs: 26, sm: 46, md: 58 },
          pointerEvents: 'none',
          zIndex: 15,
          userSelect: 'none',
        }}
      >
        {/* Silk Thread (Hilo de seda) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: { xs: 17, sm: 22 }, // centered with spider spinneret
            width: '1.5px',
            height: `${spiderY}px`,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.45))',
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.6)',
            transition: 'height 0.05s ease-out',
          }}
        />

        {/* Spider Container with natural pendulum swing */}
        <Box
          sx={{
            position: 'absolute',
            top: `${spiderY}px`,
            left: 0,
            transformOrigin: 'top center',
            animation: 'spiderSway 3.2s ease-in-out infinite',
            transition: 'top 0.05s ease-out',
            '@keyframes spiderSway': {
              '0%': { transform: 'rotate(-5deg)' },
              '50%': { transform: 'rotate(5deg)' },
              '100%': { transform: 'rotate(-5deg)' },
            },
          }}
        >
          <Spider size={44} />
        </Box>
      </Box>
    </>
  );
}
