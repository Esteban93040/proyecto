import { useState, Suspense } from 'react';
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import SectionTitle from '../atoms/SectionTitle';
import ProjectCard3D from '../molecules/ProjectCard3D';
import ProjectDialog from '../molecules/ProjectDialog';
import Character from '../models/Character';
import { projects } from '../../data/projects';
import { useLang } from '../../context/LangContext';
import type { Project } from '../../types/project';

const labels = {
  es: {
    title: 'Proyectos',
    subtitle: 'Haz click en una tarjeta para ver más detalles',
    controls: 'W, A, S, D o Flechas para mover a Esteban',
  },
  en: {
    title: 'Projects',
    subtitle: 'Click on a card to see more details',
    controls: 'W, A, S, D or Arrows to move Esteban',
  },
};

function Scene({ onSelect, dialogOpen }: { onSelect: (p: Project) => void; dialogOpen: boolean }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <pointLight position={[0, 4, 4]} intensity={2} />
      <pointLight position={[0, -4, 4]} intensity={0.5} color="#6366f1" />

      {/* Tarjetas de Proyectos 3D */}
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

      {/* Personaje 3D (Esteban.glb) controlado por teclado */}
      <Suspense fallback={null}>
        <Character position={[0, -1.35, 2]} scale={1.6} paused={dialogOpen} />
      </Suspense>
    </>
  );
}

export default function Projects() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<Project | null>(null);
  const { title, subtitle, controls } = labels[lang];

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

      {/* 3D Canvas con Tarjetas y Personaje */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          height: { xs: 360, sm: 440, md: 480 },
          mt: 4,
          position: 'relative',
        }}
      >
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <Scene onSelect={setSelected} dialogOpen={!!selected} />
        </Canvas>
      </Box>

      {/* Pill indicador de controles */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          mt: 2,
          px: 2,
          py: 0.6,
          borderRadius: 20,
          bgcolor: '#ffffff0d',
          border: '1px solid #ffffff20',
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          color: '#ffffffaa',
          userSelect: 'none',
        }}
      >
        <Box component="span" sx={{ color: '#ef4444', fontWeight: 700 }}>
          🎮 {lang === 'es' ? 'Controles:' : 'Controls:'}
        </Box>
        <span>{controls}</span>
      </Box>

      {/* Dialog modal al hacer click en un proyecto */}
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
