
import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import FurniturePart from './FurniturePart';
import { IkeaCaptchaProps, PartsState } from '../types';

const IkeaCaptcha: React.FC<IkeaCaptchaProps> = ({
  furnitureData,
  onVerify,
  snapDistance = 1.0,
}) => {
  
  const createInitialState = useCallback((): PartsState => {
    const initialState: PartsState = {};
    for (const partId in furnitureData) {
      initialState[partId] = {
        position: new Vector3(...furnitureData[partId].initialPosition),
        isSnapped: furnitureData[partId].isStatic || false,
      };
    }
    return initialState;
  }, [furnitureData]);
  
  const [partsState, setPartsState] = useState<PartsState>(createInitialState);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failure' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((partId: string, position: Vector3) => {
    setPartsState(prev => ({
        ...prev,
        [partId]: { ...prev[partId], position: position.clone() }
    }));
  }, []);
  
  const handleSnap = useCallback((draggedPartId: string, targetPartId: string, connectionKey: string) => {
    const draggedPartData = furnitureData[draggedPartId];
    const targetPartData = furnitureData[targetPartId];
    const targetPartState = partsState[targetPartId];

    const ownConnection = draggedPartData.connectionPoints[connectionKey];
    
    let targetConnectionKey: string | undefined;
    for(const key in targetPartData.connectionPoints){
        if(targetPartData.connectionPoints[key].target === connectionKey){
            targetConnectionKey = key;
            break;
        }
    }

    if (!targetConnectionKey) return;
    const targetConnectionData = targetPartData.connectionPoints[targetConnectionKey];
    
    const targetPointWorldPos = new Vector3(...targetConnectionData.pos).add(targetPartState.position);
    const ownPointLocalPos = new Vector3(...ownConnection.pos);
    const newDraggedPartPos = targetPointWorldPos.clone().sub(ownPointLocalPos);

    try {
      const audio = document.getElementById('snap-sound') as HTMLAudioElement;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Error playing sound:", e));
      }
    } catch (e) {
      console.error("Could not play snap sound", e);
    }

    setPartsState(prev => ({
      ...prev,
      [draggedPartId]: {
        ...prev[draggedPartId],
        position: newDraggedPartPos,
        isSnapped: true,
      }
    }));
  }, [furnitureData, partsState]);

  const handlePartDragStart = useCallback(() => setIsDragging(true), []);
  const handlePartDragEnd = useCallback(() => setIsDragging(false), []);

  const handleVerify = () => {
    const allSnapped = Object.values(partsState).every(part => part.isSnapped);
    onVerify(allSnapped);
    setVerificationStatus(allSnapped ? 'success' : 'failure');
    setTimeout(() => setVerificationStatus(null), 3000);
  };
  
  const handleReset = () => {
    setPartsState(createInitialState());
    setVerificationStatus(null);
    setIsDragging(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-full">
      <div className="p-4 bg-blue-600">
        <p className="text-sm text-blue-100">Assemble the</p>
        <h2 className="text-2xl font-bold text-white">IKEA Furniture</h2>
      </div>
      <div className="w-full h-[50vh] md:h-[60vh] relative bg-white">
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={0.8} />
            <directionalLight 
              position={[10, 15, 5]} 
              intensity={1.0} 
              castShadow 
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <OrbitControls 
               enabled={!isDragging}
               minDistance={5} 
               maxDistance={30} 
               enablePan={false}
             />
            <group position-y={-1}>
              {Object.entries(partsState).map(([partId, partState]) => (
                <FurniturePart
                  key={partId}
                  partId={partId}
                  partData={furnitureData[partId]}
                  partState={partState}
                  allPartsState={partsState}
                  furnitureData={furnitureData}
                  onSnap={handleSnap}
                  onDrag={handleDrag}
                  onDragStart={handlePartDragStart}
                  onDragEnd={handlePartDragEnd}
                  snapDistance={snapDistance}
                />
              ))}
            </group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
                <planeGeometry args={[100, 100]}/>
                <shadowMaterial opacity={0.2} />
            </mesh>
          </Suspense>
        </Canvas>
        {verificationStatus && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 p-3 rounded-md text-white font-semibold text-lg ${verificationStatus === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'}`}>
            {verificationStatus === 'success' ? 'Verification Successful!' : 'Assembly incorrect.'}
          </div>
        )}
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <button 
          onClick={handleReset} 
          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
          aria-label="Reset assembly"
          >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 32 32">
            <path d="M27,8H6.83l3.58-3.59L9,3,3,9l6,6,1.41-1.41L6.83,10H27V26H7V19H5v7a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V10A2,2,0,0,0,27,8Z"/>
           </svg>
        </button>
        <button 
          onClick={handleVerify}
          className="px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
          Verify
        </button>
      </div>
    </div>
  );
};

export default IkeaCaptcha;