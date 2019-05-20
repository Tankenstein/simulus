import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Grid, GridColumn, Header, Icon, Label, Placeholder } from 'semantic-ui-react';

import { useScenarioModules } from '../../scenarioHooks';
import Scenario from '../../Scenario';
import ScenarioForm from '../../ScenarioForm';

interface ScenarioOverviewProps {
  scenario: Scenario;
  onEditScenario: (scenario: Scenario) => any;
  onDeleteScenario: (id: string) => any;
}

/**
 * Little overview of a scenario where you can also edit/update the current scenario
 * @param param0 props
 */
const ScenarioOverview = ({
  scenario,
  onEditScenario,
  onDeleteScenario,
}: ScenarioOverviewProps) => {
  const [editing, setEditing] = useState(false);
  const modules = useScenarioModules(scenario);
  const someMissingModule = modules.some(module => !module);
  if (someMissingModule) {
    return <Redirect to="/scenarios" />;
  }

  return editing ? (
    <ScenarioForm
      initialValue={scenario}
      onSubmit={edit => {
        setEditing(false);
        onEditScenario({ ...scenario, name: edit.name });
      }}
      onCancel={() => setEditing(false)}
    />
  ) : (
    <Grid doubling>
      <GridColumn width="8">
        <Header as="h1">{scenario!.name}</Header>
        <Label.Group>
          {modules.map(module => (
            <Label key={module.id}>
              <Icon name="boxes" />
              {module.name}
            </Label>
          ))}
        </Label.Group>
      </GridColumn>
      <GridColumn width="8" floated="right" textAlign="right">
        <Button onClick={() => setEditing(true)}>Edit</Button>
        <Button
          color="red"
          onClick={() => onDeleteScenario(scenario.id)}
          style={{ marginRight: 0 }}
        >
          Delete
        </Button>
      </GridColumn>
    </Grid>
  );
};

export default ScenarioOverview;
