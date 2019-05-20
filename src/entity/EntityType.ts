import { PropertyType } from './PropertyType';

export interface EntityType {
  id: string;
  name: string;
  description: string;
  ownProperties: PropertyType[];
  baseTypeId?: string;
}
