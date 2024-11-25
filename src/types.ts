export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MapCell {
  id: string;
  coordinate: Coordinate;
  importanceLevel: number;
  threatLevel: number;
  buildingDensity: number;
  isInIsrael: boolean;
}
export interface Alert {
  id: string;
  category: string;
  title: string;
  description: string;
  areas: AlertArea[];
  timestamp: Date;
}
export interface AlertArea {
  areaName: string;
  areaNameHe: string;
  lat: number;
  lng: number;
  threatLevel: number;}

export interface Dome {
  id: string;
  coordinate: Coordinate;
}

export interface DomeMovement {
  id: string;
  from: Coordinate;
  to: Coordinate;
}