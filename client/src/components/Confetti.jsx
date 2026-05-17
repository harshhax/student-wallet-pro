import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti = ({ active }) => {
  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#4f8ef7', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [active]);

  return null;
};

export default Confetti;
