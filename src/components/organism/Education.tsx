import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionTitle from '../atoms/SectionTitle';
import InfoCard from '../molecules/InfoCard';
import { useLang } from '../../context/LangContext';

const educationData = {
  es: {
    title: 'Formación Académica',
    subtitle: 'Estudios, carreras y certificaciones',
    items: [
      {
        title: 'Bachiller Tecnico en Mecanica Automotriz',
        institution: 'Colegio Parroquial San Pedro Claver',
        department: 'Valle del Cauca',
        period: '2020',
        description:
          'Bachiller',
      },
      {
        title: 'Tecnologo en Desarrollo de Software',
        institution: 'Universidad del Valle',
        department: 'Valle del Cauca',
        period: '2025',
        description:
          'Tecnologo en Desarrollo de Software',
      },
      {
        title: 'Ingeniero en Sistemas',
        institution: 'Universidad del Valle',
        department: 'Valle del Cauca',
        period: 'En curso',
        description:
          '',
      },

      // Puedes duplicar el bloque anterior para agregar más títulos o certificaciones
    ],
  },
  en: {
    title: 'Education',
    subtitle: 'Studies, degrees, and certifications',
    items: [
      {
        title: 'Technical High School Diploma in Automotive Mechanics',
        institution: 'Colegio Parroquial San Pedro Claver',
        department: 'Valle del Cauca',
        period: '2020',
        description: 'High School Diploma',
      },
      {
        title: 'Technologist Degree in Software Development',
        institution: 'Universidad del Valle',
        department: 'Valle del Cauca',
        period: '2025',
        description: 'Software Development Technologist',
      },
      {
        title: 'Systems Engineering',
        institution: 'Universidad del Valle',
        department: 'Valle del Cauca',
        period: 'In Progress',
        description: '',
      },
    ],
  },
};

export default function Education() {
  const { lang } = useLang();
  const { title, subtitle, items } = educationData[lang];

  return (
    <Box
      id="educacion"
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
      <SectionTitle subtitle={subtitle}>{title}</SectionTitle>

      <Box
        sx={{
          maxWidth: 900,
          width: '100%',
          mt: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {items.map((edu, index) => (
          <InfoCard
            key={index}
            title={edu.title}
            institution={edu.institution}
            department={edu.department}
            period={edu.period}
            description={edu.description}
          />
        ))}
      </Box>
    </Box>
  );
}
