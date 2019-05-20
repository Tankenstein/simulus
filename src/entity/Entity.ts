import { Dict } from '../utils';
import { Property } from './Property';

export type TypeId = string;

export interface Entity {
  id: string;
  typeId: TypeId;
  name: string;
  archived: boolean;
}

export interface EntityState {
  entityId: string;
  properties: Dict<Property>;
}
