import { Omit } from 'type-fest';
import { Entity } from './Entity';
import { EntityType } from './EntityType';
import { Property } from './Property';
import Dict from '../utils/Dict';
import { PropertyType } from './PropertyType';

/**
 * This represents all you need to render an entity in its entirety.
 * It's an aggregation of An entity, its type and its current state.
 */
export type EntityStateView = Omit<Entity, 'typeId'> & {
  type: EntityType;
  properties: Dict<PropertyStateView>;
};

export type PropertyStateView = Omit<Property, 'typeId'> & {
  type: PropertyType;
};
