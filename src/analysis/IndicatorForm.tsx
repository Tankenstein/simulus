import React, { useState } from 'react';
import { Form, Dropdown, Header, Button } from 'semantic-ui-react';

import { Indicator } from './Indicator';
import { Dict } from '../utils';

const IndicatorForm = ({
  availableIndicators,
  onSubmit,
  onCancel,
}: {
  availableIndicators: Dict<Indicator>;
  onSubmit: (indicator: Indicator) => any;
  onCancel: () => any;
}) => {
  const [indicator, setIndicator] = useState<string>();
  return (
    <Form
      onSubmit={event => {
        event.preventDefault();
        onSubmit(availableIndicators[indicator as string]);
      }}
    >
      <Header>Add an indicator</Header>
      <Form.Field>
        <label htmlFor="entity-type">Type</label>
        <Dropdown
          id="entity-type"
          fluid
          selection
          options={Object.values(availableIndicators).map(indicator => ({
            key: indicator.id,
            value: indicator.id,
            text: indicator.name,
          }))}
          value={indicator}
          onChange={(_, { value }) => setIndicator(value as string)}
        />
      </Form.Field>
      <Button primary type="submit" disabled={!indicator}>
        Create
      </Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
};

export default IndicatorForm;
