import React from 'react';
import { motion } from 'framer-motion';

interface ShineBorderProps {
  children?: React.ReactNode;
  className?: string;
  color?: string;
}

export const ShineBorder: React.FC<ShineBorderProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border border-white/20 ${className}`}
      whileHover={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          pointerEvents: 'none',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
