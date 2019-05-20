import React from 'react';
import { Card, Message, Label, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import { Scenario } from '..';
import { Module } from '../../module';
import { Dict } from '../../utils';

interface ScenarioListProps {
  scenarios: Scenario[];
  onDeleteScenario: (id: string) => any;
  availableModules: Dict<Module>;
}

/**
 * Renders a list of scenarios, along with module information
 * @param param0 Props
 */
const ScenarioList = ({ scenarios, onDeleteScenario, availableModules }: ScenarioListProps) => {
  return (
    <>
      {scenarios.map(scenario => {
        const usedModules = scenario.moduleIds.map(
          id => availableModules[id] || { id, name: null },
        );
        const existingModules = usedModules.filter(module => !!module.name);
        const missingModules = usedModules.filter(module => !module.name);
        const allModulesAvailable = !missingModules.length;
        return (
          <Card
            key={scenario.id}
            as={allModulesAvailable ? Link : undefined}
            to={`/scenarios/${scenario.id}`}
          >
            <Card.Content>
              <Card.Header>{scenario.name}</Card.Header>
              <Card.Meta>
                Created <Moment fromNow date={scenario.createdAt} />
              </Card.Meta>
              {!allModulesAvailable ? (
                <Message negative style={{ marginBottom: '8px' }}>
                  <p>Missing modules</p>
                  {missingModules.map(module => (
                    <Label key={module.id} color="red">
                      <Icon name="boxes" />
                      {module.id}
                    </Label>
                  ))}
                </Message>
              ) : (
                ''
              )}
            </Card.Content>
            <Card.Content>
              <Card.Description>
                <p>Modules</p>{' '}
                <Label.Group style={{ marginTop: '8px' }}>
                  {existingModules.map(module => (
                    <Label key={module.id}>
                      <Icon name="boxes" />
                      {module.name}
                    </Label>
                  ))}
                </Label.Group>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button
                primary
                disabled={!allModulesAvailable}
                as={Link}
                to={`/scenarios/${scenario.id}`}
              >
                {allModulesAvailable ? 'Open' : 'Disabled'}
              </Button>
              {!allModulesAvailable ? (
                <Button color="red" onClick={() => onDeleteScenario(scenario.id)}>
                  Delete
                </Button>
              ) : (
                ''
              )}
            </Card.Content>
          </Card>
        );
      })}
    </>
  );
};

export default ScenarioList;
