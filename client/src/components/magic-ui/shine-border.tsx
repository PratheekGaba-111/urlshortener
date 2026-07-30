import React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface ShineBorderProps {
  children?: React.ReactNode;
  className?: string;
}

export const ShineBorder: React.FC<ShineBorderProps> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-white/15",
        className
      )}
      whileHover={{ borderColor: "rgba(255, 255, 255, 0.35)" }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          opacity: [0, 0.45, 0],
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
