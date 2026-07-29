import React from 'react';
import { motion } from 'framer-motion';

interface LampEffectProps {
  children?: React.ReactNode;
  className?: string;
}

export const LampEffect: React.FC<LampEffectProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Lamp glow effect */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-purple-500 to-transparent rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
