import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TracingBeamProps {
  children?: React.ReactNode;
  className?: string;
}

export const TracingBeam: React.FC<TracingBeamProps> = ({
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const { top, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(
        Math.max((windowHeight - top) / (windowHeight + height), 0),
        1
      );
      setScrollYProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Tracing line */}
      <motion.div
        className="absolute left-0 top-0 w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent"
        style={{
          height: '100%',
          scaleY: scrollYProgress,
          transformOrigin: 'top',
        }}
      />

      {/* Content */}
      <div className="relative z-10 pl-8">
        {children}
      </div>
    </div>
  );
};
