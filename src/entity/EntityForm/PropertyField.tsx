import React from 'react';
import { Form } from 'semantic-ui-react';
import { PropertyDataType, Geometry, PropertyDataTypes } from '../PropertyType';

export interface PropertyFieldProps {
  id: string;
  type: PropertyDataType;
  name: string;
  value: PropertyDataTypes;
  onChange: (value: PropertyDataTypes) => any; // TODO
}

const Geometryfield = ({
  id,
  name,
  value,
  onChange,
}: {
  id: string;
  name: string;
  value: Geometry;
  onChange: (value: Geometry) => any;
}) => {
  const htmlIdX = `entity-property-${id}-x`;
  const htmlIdY = `entity-property-${id}-y`;
  return (
    <Form.Field>
      <Form.Group widths="equal">
        <Form.Input
          fluid
          id={htmlIdX}
          label={`${name} x coordinate`}
          type="number"
          value={value.x}
          onChange={({ target: { valueAsNumber: x } }) => {
            onChange({ ...value, x });
          }}
        />
        <Form.Input
          fluid
          id={htmlIdY}
          label={`${name} y coordinate`}
          type="number"
          value={value.y}
          onChange={({ target: { valueAsNumber: y } }) => {
            onChange({ ...value, y });
          }}
        />
      </Form.Group>
    </Form.Field>
  );
};

const PropertyField = ({ id, type, name, value, onChange }: PropertyFieldProps) => {
  if (typeof value === 'undefined') {
    return <></>;
  }
  const htmlId = `entity-property-${id}`;
  let inputType = 'text'; // TODO: geometry, etc
  if (type === PropertyDataType.NUMBER) {
    inputType = 'number';
  } else if (type === PropertyDataType.GEOMETRY) {
    return <Geometryfield id={id} name={name} value={value as Geometry} onChange={onChange} />;
  }
  return (
    <Form.Field>
      <label htmlFor={htmlId}>{name}</label>
      <input
        id={htmlId}
        type={inputType}
        value={(value || '').toString()}
        onChange={({ target: { value, valueAsNumber } }) => {
          if (type === PropertyDataType.NUMBER) {
            onChange(valueAsNumber);
          } else {
            onChange(value);
          }
        }}
      />
    </Form.Field>
  );
};

export default PropertyField;
