import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '../../types/project';

interface ProjectCard3DProps {
  project: Project;
  index: number;
  total: number;
  onSelect: (p: Project) => void;
  paused: boolean;
}

export default function ProjectCard3D({ project, index, total, onSelect, paused }: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const xOffset = (index - (total - 1) / 2) * 2.8;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (!paused && !hovered) {
      meshRef.current.rotation.y += delta * 0.6;
    }
    const target = hovered ? 1.12 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      position={[xOffset, 0, 0]}
      onClick={() => onSelect(project)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <RoundedBox args={[2, 2.6, 0.18]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          roughness={0.3}
          metalness={0.6}
        />
      </RoundedBox>
      <Text position={[0, 0.5, 0.11]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" maxWidth={1.7} textAlign="center">
        {project.title}
      </Text>
      <Text position={[0, -0.2, 0.11]} fontSize={0.12} color="#ffffffcc" anchorX="center" anchorY="middle" maxWidth={1.6} textAlign="center">
        {project.tech.join(' · ')}
      </Text>
      <Text position={[0, -0.9, 0.11]} fontSize={0.1} color="#ffffff88" anchorX="center" anchorY="middle">
        Click para ver más
      </Text>
    </mesh>
  );
}
