import Box from '@mui/material/Box';

interface SpiderWebProps {
  size?: number | { xs: number; sm: number; md: number };
}

export default function SpiderWeb({ size = { xs: 150, sm: 200, md: 240 } }: SpiderWebProps) {
  // Pre-calculate radial lines and concentric sagging arcs
  const radii = [45, 90, 135, 180, 225];
  const anglesDeg = [90, 75, 60, 45, 30, 15, 0];
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Build the sagging web arc paths
  const arcPaths = radii.map((r) => {
    let d = '';
    for (let i = 0; i < anglesDeg.length; i++) {
      const a = toRad(anglesDeg[i]);
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);

      if (i === 0) {
        d += `M ${x.toFixed(1)} ${y.toFixed(1)} `;
      } else {
        const prevA = toRad(anglesDeg[i - 1]);
        const midA = (prevA + a) / 2;
        const rCtrl = r * 0.86; // sag toward the (0,0) corner
        const cx = rCtrl * Math.cos(midA);
        const cy = rCtrl * Math.sin(midA);
        d += `Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)} `;
      }
    }
    return d;
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 2,
        userSelect: 'none',
      }}
    >
      <svg
        viewBox="0 0 240 240"
        width="100%"
        height="100%"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.25))' }}
      >
        {/* Radial anchor lines */}
        {anglesDeg.map((deg) => {
          const a = toRad(deg);
          const x = 240 * Math.cos(a);
          const y = 240 * Math.sin(a);
          return (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={x.toFixed(1)}
              y2={y.toFixed(1)}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Concentric sagging web lines */}
        {arcPaths.map((d, idx) => (
          <path
            key={idx}
            d={d}
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.1"
          />
        ))}

        {/* Corner center anchor */}
        <circle cx="0" cy="0" r="3" fill="rgba(255, 255, 255, 0.6)" />
      </svg>
    </Box>
  );
}
