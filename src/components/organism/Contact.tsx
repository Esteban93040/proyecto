import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SectionTitle from '../atoms/SectionTitle';
import SocialButton from '../atoms/SocialButton';
import { useLang } from '../../context/LangContext';

const labels = {
  es: { title: 'Contacto', sub: '¿Tienes un proyecto en mente o quieres hablar? Encuéntrame en mis redes.' },
  en: { title: 'Contact', sub: 'Have a project in mind or want to chat? Find me on my socials.' },
};

const socials = [
  {
    label: 'LinkedIn',
    icon: <LinkedInIcon sx={{ fontSize: 36 }} />,
    href: 'https://www.linkedin.com/in/esteban-andres-espinosa-975a86304/', 
    color: '#0a66c2',
    hoverColor: '#1e86e5',
  },
  {
    label: 'GitHub',
    icon: <GitHubIcon sx={{ fontSize: 36 }} />,
    href: 'https://github.com/Esteban93040', // ← reemplaza
    color: '#e6edf3',
    hoverColor: '#ffffff',
  },
  {
    label: 'WhatsApp',
    icon: <WhatsAppIcon sx={{ fontSize: 36 }} />,
    href: 'https://wa.me/+573218022672', // ← reemplaza (formato internacional)
    color: '#25d366',
    hoverColor: '#40e980',
  },
];

export default function Contact() {
  const { lang } = useLang();
  const { title, sub } = labels[lang];

  return (
    <Box
      id="contacto"
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <SectionTitle>{title}</SectionTitle>
      <Typography sx={{ opacity: 0.55, mt: 2, mb: 6, maxWidth: 480, fontSize: '1rem', lineHeight: 1.8, color: '#fff' }}>
        {sub}
      </Typography>

      <Box sx={{ display: 'flex', gap: { xs: 4, sm: 6 }, flexWrap: 'wrap', justifyContent: 'center' }}>
        {socials.map((s) => (
          <SocialButton key={s.label} {...s} />
        ))}
      </Box>
    </Box>
  );
}
