import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionTitle from '../atoms/SectionTitle';
import InfoCard from '../molecules/InfoCard';
import { useLang } from '../../context/LangContext';

const experienceData = {
  es: {
    title: 'Experiencia Laboral',
    subtitle: 'Trayectoria y desempeño profesional',
    items: [
      {
        title: 'Monitor Administrativo y Soporte',
        institution: 'Universidad del Valle',
        department: 'Escuela de Ingeniería Civil y Geomática',
        period: '2023 - Presente', // ← Puedes ajustar el período
        description:
          'descripción',
      },
    ],
  },
  en: {
    title: 'Work Experience',
    subtitle: 'Career trajectory and professional performance',
    items: [
      {
        title: 'Administrative and Support Monitor',
        institution: 'Universidad del Valle',
        department: 'School of Civil and Geomatic Engineering',
        period: '2023 - Present', // ← Adjust period as needed
        description:
          'description',
      },
    ],
  },
};

export default function LaboralExperience() {
  const { lang } = useLang();
  const { title, subtitle, items } = experienceData[lang];

  return (
    <Box
      id="experiencia"
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
        {items.map((exp, index) => (
          <InfoCard
            key={index}
            title={exp.title}
            institution={exp.institution}
            department={exp.department}
            period={exp.period}
            description={exp.description}
          />
        ))}
      </Box>
    </Box>
  );
}
