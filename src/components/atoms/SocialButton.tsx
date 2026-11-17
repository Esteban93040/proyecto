import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface SocialButtonProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  hoverColor: string;
}

export default function SocialButton({ label, icon, href, color, hoverColor }: SocialButtonProps) {
  return (
    <Tooltip title={label} arrow>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <IconButton
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          sx={{
            color,
            border: `2px solid ${color}55`,
            borderRadius: '50%',
            p: 2,
            transition: 'all 0.25s ease',
            '&:hover': {
              color: hoverColor,
              borderColor: hoverColor,
              bgcolor: `${hoverColor}18`,
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 24px ${hoverColor}44`,
            },
          }}
        >
          {icon}
        </IconButton>
        <Typography sx={{ fontSize: 12, opacity: 0.5, letterSpacing: 1, color: '#fff' }}>
          {label.toUpperCase()}
        </Typography>
      </Box>
    </Tooltip>
  );
}
