import Typography from '@mui/material/Typography';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

export default function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: '#ff0000',
          textAlign: 'center',
        }}
      >
        {children}
      </Typography>
      {subtitle && (
        <Typography sx={{ opacity: 0.5, mt: 1, fontSize: 14, textAlign: 'center', color: '#fff' }}>
          {subtitle}
        </Typography>
      )}
    </>
  );
}
