import React, { useEffect, useRef, useState } from 'react';

const AnimatedNumber = ({ value, prefix = '', suffix = '', duration = 1200, className = '', style = {} }) => {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = startRef.current;
    startRef.current = value;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * ease));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return (
    <span className={className} style={style}>
      {prefix}{display.toLocaleString('en-IN')}{suffix}
    </span>
  );
};

export default AnimatedNumber;
