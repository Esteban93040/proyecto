import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { useLang } from '../../context/LangContext';

const navigation = {
  es: [
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Experiencia', href: '#experiencia' },
    { label: 'Educación', href: '#educacion' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#contacto' },
  ],
  en: [
    { label: 'About me', href: '#sobre-mi' },
    { label: 'Experience', href: '#experiencia' },
    { label: 'Education', href: '#educacion' },
    { label: 'Projects', href: '#proyectos' },
    { label: 'Contact', href: '#contacto' },
  ],
};

export default function Navbar() {
  const { lang, setLang } = useLang();
  const next = lang === 'es' ? 'en' : 'es';

  return (
    <AppBar
      component="header"
      position="sticky"
      elevation={0}
      sx={{ bgcolor: '#00000099', backdropFilter: 'blur(10px)', color: '#fff' }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, sm: 72 },
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Language toggle — left slot */}
          <Button
            onClick={() => setLang(next)}
            aria-label={`Cambiar idioma a ${next === 'es' ? 'español' : 'inglés'}`}
            sx={{
              justifySelf: 'start',
              minWidth: 0,
              px: { xs: 1, sm: 1.5 },
              color: '#fff',
              transition: 'color 0.25s ease',
              '&:hover': {
                color: '#ff2222',
                bgcolor: 'transparent',
              },
            }}
          >
            {next.toUpperCase()}
          </Button>

          {/* Nav links — center */}
          <Box
            component="nav"
            aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: { xs: 0, sm: 1 },
            }}
          >
            {navigation[lang].map(({ label, href }) => (
              <Button
                key={href}
                component="a"
                href={href}
                color="inherit"
                sx={{
                  minWidth: 0,
                  px: { xs: 0.75, sm: 1.5 },
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  transition: 'color 0.25s ease',
                  '&:hover': {
                    color: '#ff2222',
                    bgcolor: 'transparent',
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
