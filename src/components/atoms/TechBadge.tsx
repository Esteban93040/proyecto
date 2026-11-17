import Box from '@mui/material/Box';

interface TechBadgeProps {
  label: string;
  color: string;
}

export default function TechBadge({ label, color }: TechBadgeProps) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.4,
        borderRadius: 10,
        bgcolor: `${color}33`,
        border: `1px solid ${color}66`,
        fontSize: 13,
        color: '#fff',
        userSelect: 'none',
      }}
    >
      {label}
    </Box>
  );
}
