import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 1,
    title: 'Proyecto 1',
    description: 'Descripción del primer proyecto. Puedes reemplazar este texto con la info real de tu proyecto.',
    tech: ['React', 'TypeScript', 'MUI'],
    link: 'https://github.com/tu-usuario',
    color: '#3b82f6',
  },
  {
    id: 2,
    title: 'Proyecto 2',
    description: 'Descripción del segundo proyecto. Agrega aquí los detalles de lo que construiste.',
    tech: ['Python', 'OpenCV', 'Flask'],
    link: 'https://github.com/tu-usuario',
    color: '#10b981',
  },
  {
    id: 3,
    title: 'Proyecto 3',
    description: 'Descripción del tercer proyecto. Menciona el problema que resuelve y cómo lo lograste.',
    tech: ['Three.js', 'WebGL', 'React'],
    link: 'https://github.com/tu-usuario',
    color: '#f59e0b',
  },
  {
    id: 4,
    title: 'Proyecto 4',
    description: 'Descripción del cuarto proyecto. Puedes incluir capturas, demos o links.',
    tech: ['AWS', 'Docker', 'Node.js'],
    link: 'https://github.com/tu-usuario',
    color: '#ec4899',
  },
];
