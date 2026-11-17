import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface InfoCardProps {
  title: string;
  institution: string;
  department?: string;
  period?: string;
  description?: string;
}

export default function InfoCard({
  title,
  institution,
  department,
  period,
  description,
}: InfoCardProps) {
  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 2.5, sm: 3.5 },
        bgcolor: '#0f0f12',
        borderRadius: 3,
        border: '1px solid #ffffff1a',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#ef444488',
          boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1,
          mb: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#fff',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Typography>

        {period && (
          <Box
            sx={{
              px: 1.5,
              py: 0.3,
              borderRadius: 10,
              bgcolor: '#ef444422',
              border: '1px solid #ef444466',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {period}
          </Box>
        )}
      </Box>

      <Typography
        variant="subtitle1"
        sx={{
          color: '#ef4444',
          fontWeight: 600,
          mb: department ? 0.5 : 1.5,
          fontSize: '0.95rem',
        }}
      >
        {institution}
      </Typography>

      {department && (
        <Typography
          variant="body2"
          sx={{ color: '#94a3b8', mb: 1.5, fontSize: '0.875rem' }}
        >
          {department}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body2"
          sx={{ color: '#ffffffcc', lineHeight: 1.8, fontSize: '0.9rem' }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
