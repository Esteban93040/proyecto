import { useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */
type Vec3 = [number, number, number];

interface BoxProps {
  size: Vec3;
  position?: Vec3;
  rotation?: Vec3;
  color?: string;
  children?: ReactNode;
  noOutline?: boolean;
  shadow?: boolean;
}

interface BuildingData {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  roofColor: string;
  tower: boolean;
}

interface VehicleData {
  pos: Vec3;
  rot: number;
  color: string;
  taxi?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */
const INK = "#16102e"; // color del contorno (tinta)
const OUTLINE = 0.16; // grosor del contorno en unidades del mundo
const PALETTE = ["#ff3d8b", "#22d3ee", "#ffd23f", "#ff7a2f", "#7b5cff", "#2ee6a6", "#ff6b6b", "#4d7cff"];

function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Sombreado en 3 escalones (cel shading)
function makeGradient(): THREE.DataTexture {
  const data = new Uint8Array([110, 190, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  tex.minFilter = tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

// Textura de fachada: puntos de semitono + ventanas
function makeFacade(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#d9cdf5";
  for (let y = 4; y < 128; y += 8)
    for (let x = ((y / 8) % 2) * 4 + 4; x < 128; x += 8) {
      g.beginPath();
      g.arc(x, y, 1.8, 0, 7);
      g.fill();
    }
  const r = rng(7);
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 2; col++) {
      const x = 12 + col * 60;
      const y = 14 + row * 60;
      g.fillStyle = INK;
      g.fillRect(x - 3, y - 3, 46, 46);
      g.fillStyle = r() > 0.6 ? "#ffe36e" : "#5fd8ff";
      g.fillRect(x, y, 40, 40);
      g.fillStyle = "rgba(255,255,255,.55)";
      g.fillRect(x + 4, y + 4, 10, 32);
    }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Se crean una sola vez en el cliente (ver SpiderCity)
let GRADIENT: THREE.DataTexture;
let FACADE: THREE.CanvasTexture;

/* ------------------------------------------------------------------ */
/*  Primitivas con contorno (inverted hull)                            */
/* ------------------------------------------------------------------ */
function Box({ size, position = [0, 0, 0], rotation = [0, 0, 0], color, children, noOutline, shadow = true }: BoxProps) {
  const [w, h, d] = size;
  const t = OUTLINE;
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow={shadow} receiveShadow>
        <boxGeometry args={size} />
        {children || <meshToonMaterial color={color} gradientMap={GRADIENT} />}
      </mesh>
      {!noOutline && (
        <mesh scale={[(w + t) / w, (h + t) / h, (d + t) / d]}>
          <boxGeometry args={size} />
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
}

function Wheel({ position }: { position: Vec3 }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.45, 14]} />
        <meshToonMaterial color="#2b2540" gradientMap={GRADIENT} />
      </mesh>
      <mesh scale={[1.18, 1.05, 1.18]}>
        <cylinderGeometry args={[0.5, 0.5, 0.45, 14]} />
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 10]} />
        <meshToonMaterial color="#ffd23f" gradientMap={GRADIENT} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Edificios                                                          */
/* ------------------------------------------------------------------ */
function Building({ x, z, w, d, h, color, roofColor, tower }: BuildingData) {
  const [mapX, mapZ] = useMemo(() => {
    const a = FACADE.clone();
    a.needsUpdate = true;
    a.repeat.set(Math.max(1, d / 4), Math.max(1, h / 4));
    const b = FACADE.clone();
    b.needsUpdate = true;
    b.repeat.set(Math.max(1, w / 4), Math.max(1, h / 4));
    return [a, b] as const;
  }, [w, d, h]);

  const bw = w * 0.35;
  const bd = d * 0.35;

  return (
    <group position={[x, 0.3, z]}>
      <Box size={[w, h, d]} position={[0, h / 2, 0]}>
        {/* orden de caras: +x, -x, +y, -y, +z, -z */}
        <meshToonMaterial attach="material-0" color={color} map={mapX} gradientMap={GRADIENT} />
        <meshToonMaterial attach="material-1" color={color} map={mapX} gradientMap={GRADIENT} />
        <meshToonMaterial attach="material-2" color={roofColor} gradientMap={GRADIENT} />
        <meshToonMaterial attach="material-3" color={color} gradientMap={GRADIENT} />
        <meshToonMaterial attach="material-4" color={color} map={mapZ} gradientMap={GRADIENT} />
        <meshToonMaterial attach="material-5" color={color} map={mapZ} gradientMap={GRADIENT} />
      </Box>
      {/* cornisa */}
      <Box size={[w + 0.5, 0.5, d + 0.5]} position={[0, h + 0.25, 0]} color={roofColor} />
      {/* caja de ascensor */}
      <Box size={[bw, 1.2, bd]} position={[-w * 0.22, h + 1.1, d * 0.2]} color="#f4efff" />
      {tower && (
        <group position={[w * 0.2, h + 0.5, -d * 0.2]}>
          {([[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]] as const).map(([a, b], i) => (
            <Box key={i} size={[0.2, 1.6, 0.2]} position={[a, 0.8, b]} color={INK} noOutline />
          ))}
          <mesh position={[0, 2.3, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 1.4, 12]} />
            <meshToonMaterial color="#ffb347" gradientMap={GRADIENT} />
          </mesh>
          <mesh position={[0, 2.3, 0]} scale={[1.1, 1.07, 1.1]}>
            <cylinderGeometry args={[0.8, 0.8, 1.4, 12]} />
            <meshBasicMaterial color={INK} side={THREE.BackSide} />
          </mesh>
          <mesh position={[0, 3.35, 0]} castShadow>
            <coneGeometry args={[0.95, 0.8, 12]} />
            <meshToonMaterial color="#ff3d8b" gradientMap={GRADIENT} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Vehículos (estáticos)                                              */
/* ------------------------------------------------------------------ */
interface VehicleProps {
  position: Vec3;
  rotation: number;
  color: string;
  taxi?: boolean;
}

function Car({ position, rotation, color, taxi }: VehicleProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[4.2, 0.9, 1.9]} position={[0, 0.85, 0]} color={color} />
      <Box size={[2.2, 0.85, 1.7]} position={[-0.2, 1.7, 0]}>
        <meshToonMaterial color="#8fe9ff" gradientMap={GRADIENT} />
      </Box>
      <Box size={[2.3, 0.15, 1.8]} position={[-0.2, 2.17, 0]} color={color} noOutline />
      <Box size={[0.15, 0.35, 0.5]} position={[2.12, 1.0, 0.6]} color="#fff3a0" noOutline />
      <Box size={[0.15, 0.35, 0.5]} position={[2.12, 1.0, -0.6]} color="#fff3a0" noOutline />
      <Box size={[0.15, 0.3, 0.5]} position={[-2.12, 1.0, 0.6]} color="#ff2d55" noOutline />
      <Box size={[0.15, 0.3, 0.5]} position={[-2.12, 1.0, -0.6]} color="#ff2d55" noOutline />
      {taxi && <Box size={[0.8, 0.3, 0.4]} position={[-0.2, 2.4, 0]} color="#ffffff" />}
      {([[1.4, 0.95], [1.4, -0.95], [-1.4, 0.95], [-1.4, -0.95]] as const).map(([a, b], i) => (
        <Wheel key={i} position={[a, 0.5, b]} />
      ))}
    </group>
  );
}

function Bus({ position, rotation, color }: Omit<VehicleProps, "taxi">) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[9, 2.9, 2.6]} position={[0, 1.95, 0]} color={color} />
      <Box size={[8.2, 0.9, 2.7]} position={[-0.2, 2.5, 0]} color="#8fe9ff" />
      <Box size={[9.1, 0.25, 2.65]} position={[0, 1.2, 0]} color="#ffffff" noOutline />
      <Box size={[0.15, 0.5, 2.0]} position={[4.55, 1.1, 0]} color="#fff3a0" noOutline />
      {[3, 1, -1, -3].map((a, i) => (
        <group key={i}>
          <Wheel position={[a + (a > 0 ? 0.5 : -0.5), 0.5, 1.2]} />
          <Wheel position={[a + (a > 0 ? 0.5 : -0.5), 0.5, -1.2]} />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Nubes planas                                                       */
/* ------------------------------------------------------------------ */
function Cloud({ position, s = 1 }: { position: Vec3; s?: number }) {
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 3],
    [3, -0.4, 0.4, 2.4],
    [-3, -0.5, 0, 2.2],
    [1.2, 1.2, 0, 2.2],
  ];
  return (
    <group position={position} scale={s}>
      {puffs.map(([x, y, z, r], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[r, 14, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh>
            <sphereGeometry args={[r + 0.22, 14, 10]} />
            <meshBasicMaterial color={INK} side={THREE.BackSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Ciudad y Sistema de Colisionadores (Colliders)                     */
/* ------------------------------------------------------------------ */
export const PITCH = 14; // distancia entre centros de manzana
export const N = 5; // manzanas por lado

export interface CityCollider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  height: number;
  type: 'building' | 'car' | 'bus';
}

export function generateCityData() {
  const r = rng(2099);
  const buildings: BuildingData[] = [];
  const cars: VehicleData[] = [];
  const buses: VehicleData[] = [];
  const half = (N - 1) / 2;

  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const cx = (i - half) * PITCH;
      const cz = (j - half) * PITCH;
      const centerBoost = 1 - Math.hypot(i - half, j - half) / (half * 1.6);
      for (let a = 0; a < 2; a++)
        for (let b = 0; b < 2; b++) {
          if (r() < 0.1) continue;
          const w = 3.6 + r() * 1.2;
          const d = 3.6 + r() * 1.2;
          const h = 5 + r() * 12 + centerBoost * r() * 22;
          const color = PALETTE[Math.floor(r() * PALETTE.length)];
          buildings.push({
            x: cx + (a ? 2.5 : -2.5),
            z: cz + (b ? 2.5 : -2.5),
            w, d, h, color,
            roofColor: PALETTE[Math.floor(r() * PALETTE.length)],
            tower: r() > 0.7,
          });
        }
    }

  // vehículos sobre las calles (entre intersecciones)
  const carColors = ["#ffd23f", "#ff3d8b", "#22d3ee", "#ffffff", "#7b5cff", "#ff7a2f"];
  for (let k = 0; k <= N; k++) {
    const street = (k - N / 2) * PITCH;
    for (let m = 0; m < N; m++) {
      const along = (m - half) * PITCH;
      [true, false].forEach((alongX) => {
        if (r() < 0.45) return;
        const lane = r() > 0.5 ? 1 : -1;
        const off = along + (r() - 0.5) * 6;
        const pos: Vec3 = alongX ? [off, 0.3, street + lane] : [street + lane, 0.3, off];
        const rot = alongX ? (lane > 0 ? 0 : Math.PI) : lane > 0 ? -Math.PI / 2 : Math.PI / 2;
        const color = carColors[Math.floor(r() * carColors.length)];
        if (r() > 0.85) buses.push({ pos, rot, color: PALETTE[Math.floor(r() * 4)] });
        else cars.push({ pos, rot, color, taxi: color === "#ffd23f" });
      });
    }
  }

  // Generación precisa de hitboxes/colliders de edificios y vehículos
  const colliders: CityCollider[] = [];

  for (const b of buildings) {
    colliders.push({
      minX: b.x - b.w / 2,
      maxX: b.x + b.w / 2,
      minZ: b.z - b.d / 2,
      maxZ: b.z + b.d / 2,
      height: b.h + 0.3,
      type: 'building',
    });
  }

  for (const c of cars) {
    const isAlongX = Math.abs(Math.sin(c.rot)) < 0.5;
    const sizeX = isAlongX ? 4.3 : 2.0;
    const sizeZ = isAlongX ? 2.0 : 4.3;
    colliders.push({
      minX: c.pos[0] - sizeX / 2,
      maxX: c.pos[0] + sizeX / 2,
      minZ: c.pos[2] - sizeZ / 2,
      maxZ: c.pos[2] + sizeZ / 2,
      height: 2.2,
      type: 'car',
    });
  }

  for (const b of buses) {
    const isAlongX = Math.abs(Math.sin(b.rot)) < 0.5;
    const sizeX = isAlongX ? 9.2 : 2.8;
    const sizeZ = isAlongX ? 2.8 : 9.2;
    colliders.push({
      minX: b.pos[0] - sizeX / 2,
      maxX: b.pos[0] + sizeX / 2,
      minZ: b.pos[2] - sizeZ / 2,
      maxZ: b.pos[2] + sizeZ / 2,
      height: 3.2,
      type: 'bus',
    });
  }

  return { buildings, cars, buses, colliders };
}

export const CITY_DATA = generateCityData();
export const CITY_COLLIDERS = CITY_DATA.colliders;

// Calcula la altura del suelo en cualquier coordenada (X, Z)
export function getGroundHeight(x: number, z: number, currentY: number = 0): number {
  // 1. Revisar si está sobre el techo de un vehículo
  for (const c of CITY_COLLIDERS) {
    if (c.type === 'car' || c.type === 'bus') {
      if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) {
        if (currentY >= c.height - 0.4) {
          return c.height;
        }
      }
    }
  }

  // 2. Revisar si está sobre una acera / manzana
  const half = (N - 1) / 2;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const cx = (i - half) * PITCH;
      const cz = (j - half) * PITCH;
      if (Math.abs(x - cx) <= 5.5 && Math.abs(z - cz) <= 5.5) {
        return 0.3; // Altura de la acera
      }
    }
  }

  // 3. Nivel de la calzada / asfalto
  return 0.0;
}

function City() {
  const { buildings, cars, buses } = CITY_DATA;

  const size = N * PITCH + 10;

  return (
    <group>
      {/* asfalto */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshToonMaterial color="#4a4378" gradientMap={GRADIENT} />
      </mesh>

      {/* manzanas / aceras */}
      {Array.from({ length: N * N }).map((_, n) => {
        const i = Math.floor(n / N);
        const j = n % N;
        return (
          <Box
            key={n}
            size={[11, 0.3, 11]}
            position={[(i - (N - 1) / 2) * PITCH, 0.15, (j - (N - 1) / 2) * PITCH]}
            color="#f1e6ff"
            shadow={false}
          />
        );
      })}

      {/* rayas de la calzada */}
      {Array.from({ length: N + 1 }).flatMap((_, k) =>
        Array.from({ length: N * 4 }).flatMap((__, m) => {
          const street = (k - N / 2) * PITCH;
          const t = (m - (N * 4) / 2 + 0.5) * 3.5;
          return [
            <mesh key={`a${k}-${m}`} rotation={[-Math.PI / 2, 0, 0]} position={[t, 0.02, street]}>
              <planeGeometry args={[1.6, 0.25]} />
              <meshBasicMaterial color="#ffd23f" />
            </mesh>,
            <mesh key={`b${k}-${m}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[street, 0.02, t]}>
              <planeGeometry args={[1.6, 0.25]} />
              <meshBasicMaterial color="#ffd23f" />
            </mesh>,
          ];
        })
      )}

      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}
      {cars.map((c, i) => (
        <Car key={i} position={c.pos} rotation={c.rot} color={c.color} taxi={c.taxi} />
      ))}
      {buses.map((c, i) => (
        <Bus key={i} position={c.pos} rotation={c.rot} color={c.color} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Escena Modular y Exportada                                         */
/* ------------------------------------------------------------------ */
export function CityScene() {
  if (!GRADIENT) {
    GRADIENT = makeGradient();
    FACADE = makeFacade();
  }

  return (
    <>
      <color attach="background" args={["#ffc9a3"]} />
      <fog attach="fog" args={["#ffc9a3", 70, 180]} />

      <hemisphereLight args={["#fff3dc", "#b79cff", 1.1]} />
      <directionalLight
        position={[40, 60, 25]}
        intensity={2.2}
        color="#fff0cf"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-far={200}
        shadow-bias={-0.0004}
      />

      <City />

      <Cloud position={[-50, 48, -60]} s={1.6} />
      <Cloud position={[40, 55, -80]} s={2} />
      <Cloud position={[70, 42, 10]} s={1.3} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Escena Completa Independiente                                      */
/* ------------------------------------------------------------------ */
export default function SpiderCity() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#ffd9a8" }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [45, 34, 52], fov: 38 }}>
        <CityScene />
        <OrbitControls target={[0, 8, 0]} maxPolarAngle={Math.PI / 2.05} minDistance={15} maxDistance={110} />
      </Canvas>
    </div>
  );
}
