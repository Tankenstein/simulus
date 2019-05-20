import mapValues from 'lodash.mapvalues';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Header } from 'semantic-ui-react';
import { PropertyType } from '..';
import Dict from '../../utils/Dict';
import { getDefaultValueForPropertyDataType, getEntityTypePropertyTypes } from '../entityServices';
import { EntityStateView } from '../EntityStateView';
import { EntityType } from '../EntityType';
import { PropertyDataTypes } from '../PropertyType';
import PropertyField from './PropertyField';

interface EntityFormProps {
  entityTypes?: Dict<EntityType>;
  initialValue?: EntityStateView;
  onSubmit: (entity: EntityFormResult) => any;
  onCancel?: () => any;
}

export interface EntityFormResult {
  id?: string;
  name?: string;
  typeId: string;
  archived?: boolean;
  propertyValues: Dict<PropertyDataTypes>;
}

/**
 * Form that allows you to dynamically create and edit entities and their states.
 * @param param0 props
 */
const EntityForm = ({ entityTypes, onSubmit, onCancel, initialValue }: EntityFormProps) => {
  const isEditing = !!initialValue;
  const [name, setName] = useState<string>(initialValue ? initialValue.name! : '');
  const [type, setType] = useState<string>(initialValue ? initialValue.type.id : '');
  const [propertyValues, setPropertyValues] = useState(
    initialValue ? mapValues(initialValue.properties, property => property.value) : {},
  );

  let selectedEntityType: EntityType | undefined;
  if (isEditing && initialValue) {
    selectedEntityType = initialValue.type;
  } else if (type && entityTypes) {
    selectedEntityType = entityTypes[type];
  }

  let allPropertiesOfType: PropertyType[] | undefined;
  if (isEditing && initialValue) {
    allPropertiesOfType = Object.values(initialValue.properties).map(property => property.type);
  } else if (selectedEntityType && entityTypes) {
    allPropertiesOfType = Object.values(
      getEntityTypePropertyTypes(selectedEntityType, entityTypes),
    );
  }

  useEffect(() => {
    if (selectedEntityType && !initialValue) {
      setPropertyValues(buildInitialPropertyValues(selectedEntityType, entityTypes!));
    }
  }, [selectedEntityType, initialValue]);

  const canSubmit = !!type;
  return (
    <Form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          id: initialValue ? initialValue.id : undefined,
          typeId: type!,
          name: name,
          propertyValues,
        });
      }}
    >
      <Header>{isEditing ? 'Edit entity' : 'Add a new entity'}</Header>
      {!isEditing ? (
        <Form.Field>
          <label htmlFor="entity-type">Type</label>
          <Dropdown
            id="entity-type"
            fluid
            selection
            options={Object.values(entityTypes!).map(type => ({
              key: type.id,
              value: type.id,
              text: type.name,
            }))}
            value={type}
            onChange={(_, { value }) => setType(value as string)}
          />
        </Form.Field>
      ) : (
        ''
      )}

      <Form.Field>
        <label htmlFor="entity-name">Name</label>
        <input
          id="entity-name"
          value={name}
          onChange={({ target: { value } }) => setName(value as string)}
        />
      </Form.Field>
      {allPropertiesOfType && allPropertiesOfType.length ? (
        <>
          <Header>{selectedEntityType!.name} properties</Header>
          {allPropertiesOfType.map(property => (
            <PropertyField
              key={property.id}
              id={property.id}
              name={property.name}
              type={property.dataType}
              value={propertyValues[property.id]}
              onChange={value =>
                setPropertyValues(lastProperties => ({ ...lastProperties, [property.id]: value }))
              }
            />
          ))}
        </>
      ) : (
        ''
      )}
      <Button primary type="submit" disabled={!canSubmit}>
        {!isEditing ? 'Create' : 'Submit'}
      </Button>
      {onCancel ? <Button onClick={onCancel}>Cancel</Button> : ''}
    </Form>
  );
};

function buildInitialPropertyValues(
  entityType: EntityType,
  allTypes: Dict<EntityType>,
): Dict<PropertyDataTypes> {
  const properties = getEntityTypePropertyTypes(entityType, allTypes);
  return mapValues(properties, value => getDefaultValueForPropertyDataType(value.dataType));
}

export default EntityForm;
