export interface PropertyType {
  id: string;
  name: string;
  dataType: PropertyDataType;
  description?: string;
}

export enum PropertyDataType {
  STRING = 'string',
  NUMBER = 'number',
  GEOMETRY = 'geometry',
}

export type PropertyDataTypes = number | string | Geometry;

export interface Geometry {
  x: number;
  y: number;
}
