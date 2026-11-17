import { useEffect, useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { useKeyboard } from './UseKeyboard'
import { CITY_COLLIDERS, getGroundHeight, type CityCollider } from './SpiderCity'

type ActionName = 'Idle' | 'Walk'

export interface CharacterProps {
  speed?: number
  position?: [number, number, number]
  scale?: number
  paused?: boolean
  bounds?: { minX: number; maxX: number; minZ: number; maxZ: number }
  positionRef?: React.MutableRefObject<THREE.Vector3>
  onPositionChange?: (pos: THREE.Vector3) => void
  colliders?: CityCollider[]
}

const GRAVITY = -24
const JUMP_FORCE = 8.5
const COLLISION_RADIUS = 0.42

export function Character({
  speed = 5.8,
  position = [0, 0, 0],
  scale = 1.4,
  paused = false,
  bounds,
  positionRef,
  onPositionChange,
  colliders,
}: CharacterProps) {
  const group = useRef<THREE.Group>(null)
  const shadowRef = useRef<THREE.Mesh>(null)
  const { scene, animations } = useGLTF('/Esteban.glb')
  const { actions } = useAnimations(animations, group)
  const keys = useKeyboard()

  const [currentAction, setCurrentAction] = useState<ActionName>('Idle')
  const direction = useRef(new THREE.Vector3())
  const velocityY = useRef(0)
  const isGrounded = useRef(true)

  // Configurar sombras en las mallas del modelo
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // Transición suave (crossfade) entre Idle y Walk
  useEffect(() => {
    if (!actions) return
    const action = actions[currentAction] || actions['Idle']
    if (!action) return

    action.reset().fadeIn(0.2).play()

    return () => {
      action.fadeOut(0.2)
    }
  }, [currentAction, actions])

  // Bucle de movimiento, física (gravedad/salto) y colisiones
  useFrame((_, delta) => {
    if (!group.current) return

    // Sincronizar referencia de posición para la cámara y los cubos de proyectos
    if (positionRef) {
      positionRef.current.copy(group.current.position)
    }
    if (onPositionChange) {
      onPositionChange(group.current.position)
    }

    if (paused) {
      if (currentAction !== 'Idle') {
        setCurrentAction('Idle')
      }
      return
    }

    const { forward, backward, left, right, jump } = keys.current

    // 1. Salto con barra espaciadora
    if (jump && isGrounded.current) {
      velocityY.current = JUMP_FORCE
      isGrounded.current = false
    }

    // 2. Gravedad y posición vertical (Y)
    velocityY.current += GRAVITY * delta
    let nextY = group.current.position.y + velocityY.current * delta

    const currentX = group.current.position.x
    const currentZ = group.current.position.z
    const groundY = getGroundHeight(currentX, currentZ, group.current.position.y)

    if (nextY <= groundY) {
      nextY = groundY
      velocityY.current = 0
      isGrounded.current = true
    } else {
      isGrounded.current = false
    }
    group.current.position.y = nextY

    // Sombra de contacto que sigue el suelo real
    if (shadowRef.current) {
      const heightAboveGround = Math.max(0, nextY - groundY)
      shadowRef.current.position.y = -heightAboveGround + 0.02
      const shadowScale = Math.max(0.35, 1 - heightAboveGround * 0.22)
      shadowRef.current.scale.set(shadowScale, shadowScale, 1)
      const shadowMat = shadowRef.current.material as THREE.MeshBasicMaterial
      if (shadowMat) {
        shadowMat.opacity = Math.max(0.12, 0.48 - heightAboveGround * 0.14)
      }
    }

    // 3. Movimiento horizontal (X y Z)
    const moveZ = Number(backward) - Number(forward)
    const moveX = Number(right) - Number(left)
    const isMoving = moveX !== 0 || moveZ !== 0

    // Animación de correr / quieto
    const nextAction: ActionName = isMoving ? 'Walk' : 'Idle'
    if (nextAction !== currentAction) {
      setCurrentAction(nextAction)
    }

    if (isMoving) {
      direction.current.set(moveX, 0, moveZ).normalize()
      const moveDist = speed * delta
      const dx = direction.current.x * moveDist
      const dz = direction.current.z * moveDist

      const targetX = currentX + dx
      const targetZ = currentZ + dz

      const activeColliders = colliders || CITY_COLLIDERS
      const r = COLLISION_RADIUS

      // Test de colisión en eje X (permite deslizamiento en esquinas y paredes)
      let blockedX = false
      for (let i = 0; i < activeColliders.length; i++) {
        const c = activeColliders[i]
        // Solo bloquea si el personaje está a la altura del objeto
        if (nextY < c.height - 0.25) {
          if (
            targetX + r > c.minX &&
            targetX - r < c.maxX &&
            currentZ + r > c.minZ &&
            currentZ - r < c.maxZ
          ) {
            blockedX = true
            break
          }
        }
      }
      const finalX = blockedX ? currentX : targetX

      // Test de colisión en eje Z (permite deslizamiento en esquinas y paredes)
      let blockedZ = false
      for (let i = 0; i < activeColliders.length; i++) {
        const c = activeColliders[i]
        if (nextY < c.height - 0.25) {
          if (
            finalX + r > c.minX &&
            finalX - r < c.maxX &&
            targetZ + r > c.minZ &&
            targetZ - r < c.maxZ
          ) {
            blockedZ = true
            break
          }
        }
      }
      const finalZ = blockedZ ? currentZ : targetZ

      // Delimitar dentro del mapa
      const minX = bounds?.minX ?? -36
      const maxX = bounds?.maxX ?? 36
      const minZ = bounds?.minZ ?? -36
      const maxZ = bounds?.maxZ ?? 36

      group.current.position.x = THREE.MathUtils.clamp(finalX, minX, maxX)
      group.current.position.z = THREE.MathUtils.clamp(finalZ, minZ, maxZ)

      // Rotación suave hacia donde camina
      const targetAngle = Math.atan2(direction.current.x, direction.current.z)
      const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        targetAngle
      )
      group.current.quaternion.rotateTowards(targetQuaternion, 14 * delta)
    }
  })

  return (
    <group ref={group} position={position} scale={scale} dispose={null}>
      {/* Centrar el modelo verticalmente para que las plantas de los pies toquen exactamente el suelo (Y=0) */}
      <primitive object={scene} position={[0, 0.5, 0]} />
      {/* Sombra de contacto en el suelo */}
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshBasicMaterial color="#16102e" transparent opacity={0.48} depthWrite={false} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/Esteban.glb')

export default Character
