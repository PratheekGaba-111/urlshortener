import React from 'react';

interface AnimatedGridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number;
  numSquares?: number;
  maxOpacity?: number;
}

export const AnimatedGridPattern: React.FC<AnimatedGridPatternProps> = ({
  className = '',
  width = 40,
  height = 40,
  x = 0,
  y = 0,
  strokeDasharray = 0,
  numSquares = 50,
  maxOpacity = 0.5,
}) => {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-white/10 stroke-white/10 ${className}`}
      width={width}
      height={height}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {Array.from({ length: numSquares }).map((_, i) => (
          <rect
            key={i}
            width={width}
            height={height}
            x={(i % 10) * width}
            y={Math.floor(i / 10) * height}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            opacity={Math.random() * maxOpacity}
            className="animate-pulse"
          />
        ))}
      </svg>
    </svg>
  );
};
