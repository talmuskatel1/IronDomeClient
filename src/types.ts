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

export interface Dome {
  id: string;
  coordinate: Coordinate;
}

export interface DomeMovement {
  id: string;
  from: Coordinate;
  to: Coordinate;
}