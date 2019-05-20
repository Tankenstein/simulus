import { PropertyDataTypes, Geometry } from './PropertyType';

export type Property = StringProperty | NumberProperty | GeometryProperty;

type StringProperty = PropertyBuilder<string>;
type NumberProperty = PropertyBuilder<number>;
type GeometryProperty = PropertyBuilder<Geometry>;

type PropertyBuilder<T extends PropertyDataTypes> = {
  typeId: string;
  value: T;
};
