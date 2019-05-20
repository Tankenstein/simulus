import React, { useState } from 'react';
import { Form, Header, Button, Dropdown, DropdownItemProps } from 'semantic-ui-react';
import { RequireAtLeastOne } from 'type-fest';

import { ScenarioParams } from '../ScenarioRepository';
import Scenario from '../Scenario';
import { Module } from '../../module';
import { Dict } from '../../utils';

interface BaseScenarioFormProps {
  onSubmit: (params: ScenarioParams) => any;
  onCancel?: () => any;
  initialValue?: Scenario;
  availableModules?: Dict<Module>;
}

/**
 * Scenario form properties
 */
export type ScenarioFormProps = RequireAtLeastOne<
  BaseScenarioFormProps,
  'initialValue' | 'availableModules'
>;

/**
 * Form that lets you create or edit scenarios.
 * if `props.initialValue` is available, we assume to be editing
 * @param props React props
 */
const ScenarioForm = (props: ScenarioFormProps) => {
  const { onSubmit, initialValue, onCancel, availableModules } = props as BaseScenarioFormProps;

  const isEditing = !!initialValue;
  const [name, setName] = useState(initialValue && initialValue.name ? initialValue.name : '');
  const [moduleIds, setModuleIds] = useState<string[]>([]);

  const moduleList = availableModules ? Object.values(availableModules) : [];
  const moduleOptions: DropdownItemProps[] = moduleList.map(module => ({
    key: `${module.id}`,
    value: `${module.id}`,
    text: module.name,
    icon: 'boxes',
  }));
  const canSubmit = !!name && (isEditing || moduleIds.length);
  return (
    <Form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          name,
          moduleIds,
        });
        setName('');
      }}
    >
      <Header>{isEditing ? 'Edit scenario' : 'Add a new scenario'}</Header>
      <Form.Field>
        <label htmlFor="scenario-name">Scenario name</label>
        <input id="scenario-name" value={name} onChange={event => setName(event.target.value)} />
      </Form.Field>
      {moduleOptions.length ? (
        <Form.Field>
          <label htmlFor="scenario-modules">Included modules</label>
          <Dropdown
            id="scenario-modules"
            fluid
            multiple
            selection
            options={moduleOptions}
            value={moduleIds}
            onChange={(_, { value }) => setModuleIds(value as string[])}
          />
        </Form.Field>
      ) : (
        ''
      )}
      <Button primary type="submit" disabled={!canSubmit}>
        {isEditing ? 'Save' : 'Create'}
      </Button>
      {onCancel ? <Button onClick={onCancel}>Cancel</Button> : ''}
    </Form>
  );
};

export default ScenarioForm;
