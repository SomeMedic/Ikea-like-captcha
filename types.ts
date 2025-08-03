import { Vector3, Color } from 'three';

export interface BoxGeometryData {
  type: 'box';
  args: [number, number, number];
}

export interface CylinderGeometryData {
  type: 'cylinder';
  args: [number, number, number, number];
}

export type GeometryData = BoxGeometryData | CylinderGeometryData;


export interface ConnectionPointData {
  pos: [number, number, number];
  target: string;
}

export interface PartData {
  isStatic?: boolean;
  geometry: GeometryData;
  initialPosition: [number, number, number];
  connectionPoints: {
    [key: string]: ConnectionPointData;
  };
}

export interface FurnitureData {
  [partId: string]: PartData;
}

export interface PartState {
  position: Vector3;
  isSnapped: boolean;
}

export interface PartsState {
  [partId: string]: PartState;
}

export interface IkeaCaptchaProps {
  furnitureData: FurnitureData;
  onVerify: (isSuccess: boolean) => void;
  snapDistance?: number;
}

export interface FurniturePartProps {
  partId: string;
  partData: PartData;
  partState: PartState;
  allPartsState: PartsState;
  furnitureData: FurnitureData;
  onSnap: (draggedPartId: string, targetPartId: string, connectionKey: string) => void;
  onDrag: (partId: string, position: Vector3) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  snapDistance: number;
}

export interface ConnectionPointProps {
    position: [number, number, number];
    color: string;
}
