import React from 'react';
import { motion } from 'framer-motion';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  className = '',
  fill = 'white',
}) => {
  return (
    <motion.div
      className={`pointer-events-none absolute h-96 w-96 rounded-full ${className}`}
      animate={{
        opacity: [0.5, 0.8, 0.5],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: `radial-gradient(circle, ${fill} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
    />
  );
};
