import { useEffect, useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { useKeyboard } from './UseKeyboard'

type ActionName = 'Idle' | 'Walk'

interface CharacterProps {
  speed?: number
  position?: [number, number, number]
  scale?: number
  paused?: boolean
}

export function Character({
  speed = 3.2,
  position = [0, -1.4, 2],
  scale = 1.6,
  paused = false,
}: CharacterProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/Esteban.glb')
  const { actions } = useAnimations(animations, group)
  const keys = useKeyboard()

  const [currentAction, setCurrentAction] = useState<ActionName>('Idle')
  const direction = useRef(new THREE.Vector3())

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

  // Bucle de movimiento y rotación en cada frame
  useFrame((_, delta) => {
    if (!group.current || paused) return

    const { forward, backward, left, right } = keys.current
    const moveZ = Number(backward) - Number(forward)
    const moveX = Number(right) - Number(left)
    const isMoving = moveX !== 0 || moveZ !== 0

    // Cambiar estado de animación solo cuando cambia el movimiento
    const nextAction: ActionName = isMoving ? 'Walk' : 'Idle'
    if (nextAction !== currentAction) {
      setCurrentAction(nextAction)
    }

    if (isMoving) {
      // Normalizar vector para que caminar en diagonal no sea más rápido
      direction.current.set(moveX, 0, moveZ).normalize()

      // Desplazar posición
      group.current.position.x += direction.current.x * speed * delta
      group.current.position.z += direction.current.z * speed * delta

      // Delimitar para que el personaje no se salga del canvas
      group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -5.2, 5.2)
      group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -0.8, 3.2)

      // Rotar suavemente hacia la dirección en la que camina
      const targetAngle = Math.atan2(direction.current.x, direction.current.z)
      const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        targetAngle
      )
      group.current.quaternion.rotateTowards(targetQuaternion, 12 * delta)
    }
  })

  return (
    <group ref={group} position={position} scale={scale} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/Esteban.glb')

export default Character
