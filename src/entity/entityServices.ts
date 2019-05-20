import { EntityType } from './EntityType';
import { Dict, keyBy } from '../utils';
import { PropertyType, Entity } from '.';
import { PropertyDataType, PropertyDataTypes } from './PropertyType';
import uuid from 'uuid/v4';

/**
 * Collapse an entity hierarchy into concrete property types, given a map of all types.
 * @param entityType
 * @param allTypes
 */
export function getEntityTypePropertyTypes(
  entityType: EntityType,
  allTypes: Dict<EntityType>,
): Dict<PropertyType> {
  const ownProperties = keyBy(entityType.ownProperties, 'id');
  if (!entityType.baseTypeId) {
    return ownProperties;
  }
  const parentProperties = getEntityTypePropertyTypes(allTypes[entityType.baseTypeId], allTypes);
  return {
    ...parentProperties,
    ...ownProperties,
  };
}

export function getDefaultValueForPropertyDataType(type: PropertyDataType): PropertyDataTypes {
  switch (type) {
    case PropertyDataType.NUMBER:
      return 0;
    case PropertyDataType.GEOMETRY:
      return { x: 0, y: 0 };
    case PropertyDataType.STRING:
    default:
      return '';
  }
}

export function createEntity({ typeId, name }: { typeId: string; name: string }): Entity {
  return {
    id: uuid(),
    typeId,
    name,
    archived: false,
  };
}
