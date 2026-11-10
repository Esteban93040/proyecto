import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

type Language = 'es' | 'en';

const navigation = {
  es: [
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#contacto' },
  ],
  en: [
    { label: 'About me', href: '#sobre-mi' },
    { label: 'Projects', href: '#proyectos' },
    { label: 'Contact', href: '#contacto' },
  ],
};

export default function Navbar() {
  const [language, setLanguage] = useState<Language>('es');
  const nextLanguage = language === 'es' ? 'en' : 'es';

  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{ bgcolor: "transparent", color: 'red' }}
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
          <Button
            onClick={() => setLanguage(nextLanguage)}
            aria-label={`Cambiar idioma a ${nextLanguage === 'es' ? 'español' : 'inglés'}`}
            sx={{ justifySelf: 'start', minWidth: 0, px: { xs: 1, sm: 1.5 } }}
          >
            {language === 'es' ? 'EN' : 'ES'}
          </Button>

          <Box
            component="nav"
            aria-label={language === 'es' ? 'Navegación principal' : 'Main navigation'}
            sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 0, sm: 1 } }}
          >
            {navigation[language].map(({ label, href }) => (
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
