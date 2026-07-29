import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  className = '',
  speed = 50,
  direction = 'left',
}) => {
  const duration = 20 / (speed / 50);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: direction === 'left' ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};
