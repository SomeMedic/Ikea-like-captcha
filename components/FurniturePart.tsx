
import React, { useState, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import { Vector3, Plane } from 'three';
import * as THREE from 'three';
import ConnectionPoint from './ConnectionPoint';
import { FurniturePartProps } from '../types';
import './ProceduralWoodMaterial'; // Import for side-effects (extends THREE.MeshStandardMaterial)

const FurniturePart: React.FC<FurniturePartProps> = ({
  partId,
  partData,
  partState,
  allPartsState,
  furnitureData,
  onSnap,
  onDrag,
  onDragStart,
  onDragEnd,
  snapDistance,
}) => {
  const { camera } = useThree();
  const [isHovered, setHovered] = useState(false);
  
  const plane = useMemo(() => new Plane(), []);
  const worldPos = useMemo(() => new Vector3(), []);
  const offset = useMemo(() => new Vector3(), []);
  
  const connectionPoints = Object.entries(partData.connectionPoints);

  const bind = useGesture({
    onDragStart: ({ event }) => {
      if (partState.isSnapped) return;
      onDragStart();
      const e = event as any;
      const mesh = e.object as THREE.Mesh;
      plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), e.point);
      offset.copy(e.point).sub(mesh.position);
    },
    onDrag: ({ event }) => {
      if (partState.isSnapped) return;
      const e = event as any;
      if (e.ray && e.ray.intersectPlane(plane, worldPos)) {
        onDrag(partId, worldPos.sub(offset));
      }
    },
    onDragEnd: () => {
        onDragEnd();

        if (partState.isSnapped) return;

        for (const [ownConnectionKey, ownConnectionData] of Object.entries(partData.connectionPoints)) {
          const ownPointWorldPos = new Vector3(...ownConnectionData.pos).add(partState.position);

          for (const [otherPartId, otherPartData] of Object.entries(furnitureData)) {
            if (partId === otherPartId) continue;

            const otherPartState = allPartsState[otherPartId];
            if (!otherPartState || !otherPartState.isSnapped) continue;

            for (const [otherConnectionKey, otherConnectionData] of Object.entries(otherPartData.connectionPoints)) {
              if (otherConnectionKey === ownConnectionData.target) {
                const otherPointWorldPos = new Vector3(...otherConnectionData.pos).add(otherPartState.position);
                const distance = ownPointWorldPos.distanceTo(otherPointWorldPos);

                if (distance < snapDistance) {
                  onSnap(partId, otherPartId, ownConnectionKey);
                  return; 
                }
              }
            }
          }
        }
    },
    onHover: ({ hovering }) => setHovered(hovering ?? false),
  }, {
    drag: {
        filterTaps: true,
        from: () => [0,0], 
    }
  });

  const color = new THREE.Color('#FFFFFF');
  const emissiveColor = isHovered && !partState.isSnapped ? new THREE.Color('#FDE047') : new THREE.Color('#000000');


  return (
    <mesh
      {...bind() as any}
      position={partState.position}
      castShadow
      receiveShadow
    >
      {partData.geometry.type === 'box' && <boxGeometry args={partData.geometry.args} />}
      {partData.geometry.type === 'cylinder' && <cylinderGeometry args={partData.geometry.args} />}
      
      <proceduralWoodMaterial
        attach="material"
        uColor={color}
        uEmissive={emissiveColor}
        uEmissiveIntensity={0.6}
      />
      {connectionPoints.map(([key, point]) => (
        <ConnectionPoint 
          key={key} 
          position={point.pos} 
          color={partState.isSnapped ? '#22c55e' : '#ef4444'}
        />
      ))}
    </mesh>
  );
};

export default React.memo(FurniturePart);