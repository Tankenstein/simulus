import React from 'react';

import { PropertyStateView } from '../EntityStateView';
import { PropertyDataType, Geometry } from '../PropertyType';

const PropertyDisplay = ({ property }: { property: PropertyStateView }) => {
  const render = (data: React.ReactNode) => (
    <>
      {property.type.name}: {data}
      <br />
    </>
  );

  if (property.type.dataType === PropertyDataType.GEOMETRY) {
    const point = property.value as Geometry;
    return render(`(${point.x}, ${point.y})`);
  }
  return render(property.value);
};

export default PropertyDisplay;
