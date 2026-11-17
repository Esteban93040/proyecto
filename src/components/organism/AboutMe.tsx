import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SectionTitle from '../atoms/SectionTitle';
import ProfilePhoto from '../molecules/ProfilePhoto';
import { useLang } from '../../context/LangContext';
// import photo from '../../assets/photo.jpg'; // ← descomenta y agrega tu foto

const content = {
  es: {
    title: 'Sobre mí',
    bio: [
      'Soy Esteban, desarrollador de software Junior con pasión por la tecnología y la innovación.',
      'Tengo conocimientos en procesamiento de imágenes, servicios cloud y diseño UX/UI.',
      'Me encanta aprender nuevas herramientas y construir experiencias web interactivas que combinen creatividad y funcionalidad.',
    ],
  },
  en: {
    title: 'About me',
    bio: [
      'I am Esteban, a Junior software developer with a passion for technology and innovation.',
      'I have knowledge in image processing, cloud services, and UX/UI design.',
      'I love learning new tools and building interactive web experiences that combine creativity and functionality.',
    ],
  },
};

export default function AboutMe() {
  const { lang } = useLang();
  const { title, bio } = content[lang];

  return (
    <Box
      id="sobre-mi"
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 10 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container spacing={6} sx={{ maxWidth: 1100, width: '100%', alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ProfilePhoto /* src={photo} */ />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <SectionTitle>{title}</SectionTitle>
          {bio.map((p, i) => (
            <Typography
              key={i}               
              variant="body1"
              sx={{ mt: 2, lineHeight: 1.9, opacity: 0.85, color: '#ffffff', fontSize: { xs: '1rem', md: '1.1rem' } }}
            >
              {p}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
