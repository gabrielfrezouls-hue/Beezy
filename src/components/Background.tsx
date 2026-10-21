import React from 'react';

interface BackgroundProps {
  theme?: string;
}

export const Background: React.FC<BackgroundProps> = ({ theme = 'honey' }) => {
  const isDark = theme === 'night' || theme === 'neon';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500">
      {/* Dégradé de fond principal */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? 'bg-gradient-to-br from-slate-950 via-stone-900 to-amber-950/40'
            : 'bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-yellow-100/70'
        }`}
      />

      {/* Motif géométrique Alvéoles (Nid d'abeille SVG) */}
      <svg
        className={`absolute inset-0 w-full h-full ${
          isDark ? 'opacity-[0.06]' : 'opacity-[0.12]'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="beezy-hexagons"
            width="56"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.2)"
          >
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <path
              d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
              fill="none"
              stroke="#d97706"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#beezy-hexagons)" />
      </svg>

      {/* Halos lumineux "Pollen" */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl" />
    </div>
  );
};

export default Background;
