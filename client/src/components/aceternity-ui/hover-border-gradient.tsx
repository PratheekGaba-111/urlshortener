import React from 'react';
import { motion } from 'framer-motion';

interface HoverBorderGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const HoverBorderGradient: React.FC<HoverBorderGradientProps> = ({
  children,
  className = '',
  containerClassName = '',
}) => {
  return (
    <motion.div
      className={`relative group rounded-lg p-px overflow-hidden ${containerClassName}`}
      whileHover={{ scale: 1.02 }}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Inner content */}
      <div className={`relative bg-black rounded-lg ${className}`}>
        {children}
      </div>
    </motion.div>
  );
};
