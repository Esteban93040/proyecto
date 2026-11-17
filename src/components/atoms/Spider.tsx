import Box from '@mui/material/Box';

interface SpiderProps {
  size?: number;
  className?: string;
}

export default function Spider({ size = 44 }: SpiderProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size * 1.25,
        display: 'inline-block',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.2))',
      }}
    >
      <svg
        viewBox="0 0 50 62"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {/* === LEGS (8 jointed legs) === */}
        {/* Left Leg 1 (Front - reaching down) */}
        <path
          d="M 21 38 Q 11 44 6 56"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Left Leg 2 (Mid-front) */}
        <path
          d="M 20 35 Q 8 38 4 45"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Left Leg 3 (Mid-back) */}
        <path
          d="M 20 33 Q 6 25 7 16"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Left Leg 4 (Back - reaching up along thread) */}
        <path
          d="M 21 31 Q 10 16 14 5"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right Leg 1 (Front - reaching down) */}
        <path
          d="M 29 38 Q 39 44 44 56"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Right Leg 2 (Mid-front) */}
        <path
          d="M 30 35 Q 42 38 46 45"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Right Leg 3 (Mid-back) */}
        <path
          d="M 30 33 Q 44 25 43 16"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Right Leg 4 (Back - reaching up along thread) */}
        <path
          d="M 29 31 Q 40 16 36 5"
          stroke="#cbd5e1"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* === ABDOMEN (Top/Rear) === */}
        <ellipse
          cx="25"
          cy="20"
          rx="9.5"
          ry="12"
          fill="#1e1e24"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Spider Emblem / Red Hourglass on Abdomen */}
        <path
          d="M 22 16 L 28 16 L 26 20 L 28 24 L 22 24 L 24 20 Z"
          fill="#ef4444"
        />

        {/* === CEPHALOTHORAX (Thorax/Head - Bottom) === */}
        <circle
          cx="25"
          cy="36"
          r="7.5"
          fill="#27272a"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Chelicerae / Fangs */}
        <path
          d="M 23 42 L 22 47 L 24 45"
          stroke="#e2e8f0"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 27 42 L 28 47 L 26 45"
          stroke="#e2e8f0"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes (Spider eyes glowing white) */}
        <circle cx="23.5" cy="38" r="1.1" fill="#ffffff" />
        <circle cx="26.5" cy="38" r="1.1" fill="#ffffff" />
        <circle cx="21.5" cy="36.5" r="0.8" fill="#ffffff" opacity="0.8" />
        <circle cx="28.5" cy="36.5" r="0.8" fill="#ffffff" opacity="0.8" />
      </svg>
    </Box>
  );
}
