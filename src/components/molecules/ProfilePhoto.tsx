import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ProfilePhotoProps {
  /** Import your photo and pass it here: import photo from '../../assets/photo.jpg' */
  src?: string;
  alt?: string;
  size?: number | { xs: number; md: number };
}

export default function ProfilePhoto({ src, alt = 'Foto de perfil', size = { xs: 200, md: 260 } }: ProfilePhotoProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '3px solid #ffffff55',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#ffffff11',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 0 40px #ffffff22',
        mx: 'auto',
      }}
    >
      {src ? (
        <Box component="img" src={src} alt={alt} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <Typography sx={{ color: '#ffffff55', fontSize: 13, textAlign: 'center', px: 2 }}>
          foto
        </Typography>
      )}
    </Box>
  );
}
