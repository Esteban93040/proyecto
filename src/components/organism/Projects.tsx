import { useState } from 'react';
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import SectionTitle from '../atoms/SectionTitle';
import ProjectCard3D from '../molecules/ProjectCard3D';
import ProjectDialog from '../molecules/ProjectDialog';
import { projects } from '../../data/projects';
import { useLang } from '../../context/LangContext';
import type { Project } from '../../types/project';

const labels = {
  es: { title: 'Proyectos', subtitle: 'Haz click en una tarjeta para ver más detalles' },
  en: { title: 'Projects', subtitle: 'Click on a card to see more details' },
};

function Scene({ onSelect, dialogOpen }: { onSelect: (p: Project) => void; dialogOpen: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 4, 4]} intensity={2} />
      <pointLight position={[0, -4, 4]} intensity={0.5} color="#6366f1" />
      {projects.map((p, i) => (
        <ProjectCard3D
          key={p.id}
          project={p}
          index={i}
          total={projects.length}
          onSelect={onSelect}
          paused={dialogOpen}
        />
      ))}
    </>
  );
}

export default function Projects() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<Project | null>(null);
  const { title, subtitle } = labels[lang];

  return (
    <Box
      id="proyectos"
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SectionTitle subtitle={subtitle}>{title}</SectionTitle>

      <Box sx={{ width: '100%', maxWidth: 1100, height: { xs: 320, md: 420 }, mt: 4 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <Scene onSelect={setSelected} dialogOpen={!!selected} />
        </Canvas>
      </Box>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
