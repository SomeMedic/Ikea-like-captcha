
import React from 'react';
import { ConnectionPointProps } from '../types';

const ConnectionPoint: React.FC<ConnectionPointProps> = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  );
};

export default ConnectionPoint;
