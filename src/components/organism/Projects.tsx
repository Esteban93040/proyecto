import { useState, useRef, useMemo, Suspense } from 'react';
import Box from '@mui/material/Box';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SectionTitle from '../atoms/SectionTitle';
import ProjectDialog from '../molecules/ProjectDialog';
import Character from '../models/Character';
import { CityScene } from '../models/SpiderCity';
import { projects } from '../../data/projects';
import { useLang } from '../../context/LangContext';
import type { Project } from '../../types/project';

const labels = {
  es: {
    title: 'Proyectos',
    subtitle: 'Explora SpiderCity con Esteban. Salta, esquiva edificios y colisiona con los proyectos',
    controls: 'W, A, S, D: Moverse | Espacio: Saltar | Mouse: Rotar cámara / Zoom',
    instructions: 'Camina por las calles (Espacio para saltar) y colisiona con los cubos para ver los proyectos',
  },
  en: {
    title: 'Projects',
    subtitle: 'Explore SpiderCity with Esteban. Jump, dodge buildings, and collide with projects',
    controls: 'W, A, S, D: Move | Space: Jump | Mouse: Rotate Camera / Zoom',
    instructions: 'Walk through streets (Space to jump) and collide with cubes to view projects',
  },
};

// Coordenadas accesibles sobre las calles de SpiderCity
const PROJECT_POSITIONS: [number, number, number][] = [
  [7, 0.9, -8],   // Proyecto 1 (Calle Norte)
  [7, 0.9, 8],    // Proyecto 2 (Calle Sur)
  [-7, 0.9, 8],   // Proyecto 3 (Calle Oeste - Sur)
  [-7, 0.9, -8],  // Proyecto 4 (Calle Oeste - Norte)
];

/* ------------------------------------------------------------------ */
/*  Cámara cercana y controlable con el Mouse (OrbitControls)          */
/* ------------------------------------------------------------------ */
function PlayerCameraController({ targetRef }: { targetRef: React.MutableRefObject<THREE.Vector3> }) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const prevPos = useRef<THREE.Vector3 | null>(null);

  useFrame(() => {
    if (!controlsRef.current || !targetRef.current) return;
    const current = targetRef.current;
    const targetY = current.y + 0.9; // Nivel de enfoque (pecho/cabeza del personaje)

    // En el primer frame asegurar que la cámara y el target orbiten exactamente a Esteban
    if (!prevPos.current) {
      controlsRef.current.target.set(current.x, targetY, current.z);
      camera.position.set(current.x, current.y + 2.5, current.z + 5.0);
      controlsRef.current.update();
      prevPos.current = new THREE.Vector3().copy(current);
      return;
    }

    // Desplazamiento del personaje en este frame
    const dx = current.x - prevPos.current.x;
    const dy = current.y - prevPos.current.y;
    const dz = current.z - prevPos.current.z;

    if (dx !== 0 || dy !== 0 || dz !== 0) {
      // Mover la cámara la misma distancia para mantener el ángulo elegido por el usuario con el mouse
      camera.position.x += dx;
      camera.position.y += dy;
      camera.position.z += dz;

      // Fijar el objetivo de rotación exactamente sobre el personaje
      controlsRef.current.target.set(current.x, targetY, current.z);
      controlsRef.current.update();

      prevPos.current.copy(current);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[targetRef.current.x, targetRef.current.y + 0.9, targetRef.current.z]}
      enablePan={false}
      minDistance={2.5}
      maxDistance={11}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 8}
      rotateSpeed={0.7}
      zoomSpeed={0.8}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Cubo 3D Interactivo (Proyecto) con estilo Spider-Verse             */
/* ------------------------------------------------------------------ */
function ProjectCube({
  project,
  position,
  onSelect,
}: {
  project: Project;
  position: [number, number, number];
  onSelect: (p: Project) => void;
}) {
  const cubeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!cubeRef.current) return;
    // Rotación continua
    cubeRef.current.rotation.y += delta * 1.5;
    cubeRef.current.rotation.x = Math.sin(Date.now() * 0.002) * 0.15;
    // Flotación arriba y abajo
    cubeRef.current.position.y = position[1] + Math.sin(Date.now() * 0.0035) * 0.25;
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Baliza o anillo en el asfalto que marca la zona de colisión */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.4, 1.7, 32]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Cubo flotante */}
      <group
        ref={cubeRef}
        position={[0, position[1], 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1.0}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.7 : 0.25}
            roughness={0.2}
          />
        </mesh>
        {/* Contorno estilo tinta de historieta */}
        <mesh scale={[1.16, 1.16, 1.16]}>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial color="#16102e" side={THREE.BackSide} />
        </mesh>
      </group>

      {/* Rótulo flotante encima del cubo */}
      <Html position={[0, position[1] + 1.8, 0]} center distanceFactor={16} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(22, 16, 46, 0.92)',
            border: `2px solid ${project.color}`,
            borderRadius: '10px',
            padding: '5px 12px',
            color: '#fff',
            fontFamily: '"Bangers", system-ui, sans-serif',
            fontSize: '15px',
            letterSpacing: '0.8px',
            whiteSpace: 'nowrap',
            boxShadow: `0 4px 15px ${project.color}66`,
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {project.title}
          <div style={{ fontSize: '10px', color: '#ffd9a8', fontFamily: 'sans-serif', fontWeight: 600 }}>
            💥 ¡Colisiona aquí!
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Detector de Colisiones Personaje <-> Cubos de Proyecto            */
/* ------------------------------------------------------------------ */
function CollisionSystem({
  characterPosRef,
  items,
  onCollide,
  paused,
}: {
  characterPosRef: React.MutableRefObject<THREE.Vector3>;
  items: Array<{ project: Project; position: [number, number, number] }>;
  onCollide: (p: Project) => void;
  paused: boolean;
}) {
  const lastCollidedId = useRef<number | null>(null);
  const cooldownRef = useRef(false);

  useFrame(() => {
    if (paused || cooldownRef.current || !characterPosRef.current) return;

    const charPos = characterPosRef.current;
    let nearProject: Project | null = null;

    for (const item of items) {
      const [bx, , bz] = item.position;
      const dx = charPos.x - bx;
      const dz = charPos.z - bz;
      const distance = Math.hypot(dx, dz);

      // Colisión cuando Esteban está a menos de 2.0 unidades del cubo
      if (distance < 2.0) {
        nearProject = item.project;
        break;
      }
    }

    if (nearProject) {
      if (lastCollidedId.current !== nearProject.id) {
        lastCollidedId.current = nearProject.id;
        cooldownRef.current = true;
        onCollide(nearProject);

        // Previene reaperturas inmediatas en bucle
        setTimeout(() => {
          cooldownRef.current = false;
        }, 1200);
      }
    } else {
      // Al alejarse del cubo se resetea para poder volver a activarlo
      lastCollidedId.current = null;
    }
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Escena Completa 3D                                                 */
/* ------------------------------------------------------------------ */
function ProjectsScene({
  onSelect,
  dialogOpen,
}: {
  onSelect: (p: Project) => void;
  dialogOpen: boolean;
}) {
  // Posición inicial de Esteban en la calle despejada entre los proyectos
  const initialPos: [number, number, number] = [6, 0, 0];
  const characterPosRef = useRef(new THREE.Vector3(...initialPos));

  const items = useMemo(() => {
    return projects.map((p, idx) => ({
      project: p,
      position: PROJECT_POSITIONS[idx % PROJECT_POSITIONS.length],
    }));
  }, []);

  return (
    <>
      {/* Escenario de SpiderCity con todos sus edificios, calles, coches y nubes */}
      <CityScene />

      {/* Cubos de proyectos distribuidos por la ciudad */}
      {items.map((item) => (
        <ProjectCube
          key={item.project.id}
          project={item.project}
          position={item.position}
          onSelect={onSelect}
        />
      ))}

      {/* Personaje 3D (Esteban) con física, gravedad, salto y colisión con edificios/vehículos */}
      <Suspense fallback={null}>
        <Character
          position={initialPos}
          scale={1.4}
          speed={5.8}
          paused={dialogOpen}
          positionRef={characterPosRef}
          bounds={{ minX: -36, maxX: 36, minZ: -36, maxZ: 36 }}
        />
      </Suspense>

      {/* Cámara en tercera persona cercana y orientable libremente con el Mouse */}
      <PlayerCameraController targetRef={characterPosRef} />

      {/* Sistema de detección de colisión con los cubos de proyectos */}
      <CollisionSystem
        characterPosRef={characterPosRef}
        items={items}
        onCollide={onSelect}
        paused={dialogOpen}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Componente Principal de la Sección Proyectos                       */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<Project | null>(null);
  const { title, subtitle, controls, instructions } = labels[lang];

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

      {/* 3D Canvas interactivo */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          height: { xs: 450, sm: 530, md: 600 },
          mt: 4,
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
          background: '#ffd9a8',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [7, 2.5, 4.8], fov: 46 }}
        >
          <ProjectsScene onSelect={setSelected} dialogOpen={!!selected} />
        </Canvas>

        {/* Banner flotante de instrucción dentro del Canvas */}
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(22, 16, 46, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 210, 63, 0.4)',
            px: 2,
            py: 0.6,
            borderRadius: 3,
            color: '#ffd23f',
            fontFamily: '"Bangers", system-ui, sans-serif',
            letterSpacing: 0.8,
            fontSize: { xs: '0.82rem', sm: '0.95rem' },
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          🏙️ {instructions}
        </Box>
      </Box>

      {/* Pill indicador de controles */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          mt: 2.5,
          px: 2.5,
          py: 0.8,
          borderRadius: 20,
          bgcolor: '#ffffff0d',
          border: '1px solid #ffffff20',
          fontSize: { xs: '0.78rem', sm: '0.88rem' },
          color: '#ffffffaa',
          userSelect: 'none',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Box component="span" sx={{ color: '#ef4444', fontWeight: 700 }}>
          🎮 {lang === 'es' ? 'Controles:' : 'Controls:'}
        </Box>
        <span>{controls}</span>
      </Box>

      {/* Dialog modal que se abre automáticamente por colisión */}
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
