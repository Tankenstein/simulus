import React from 'react';
import { Segment, Header, Icon, Card, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { useScenarios } from '../scenarioHooks';
import { remove } from '../ScenarioRepository';
import CreateScenarioPrompt from './CreateScenarioPrompt';
import { useModules } from '../../module';
import ScenarioList from './ScenarioList';

/**
 * Page that lists scenarios
 */
const ScenarioListPage = () => {
  const { scenarios, reload } = useScenarios();
  const availableModules = useModules();

  if (!scenarios) {
    return <></>;
  }

  async function deleteScenario(id: string) {
    await remove(id);
    reload();
  }

  if (!scenarios.length) {
    return <CreateScenarioPrompt />;
  }

  return (
    <Card.Group itemsPerRow={3} doubling stackable style={{ marginTop: '8px' }}>
      <ScenarioList
        availableModules={availableModules}
        scenarios={scenarios}
        onDeleteScenario={deleteScenario}
      />
      <Card as={Link} to="/scenarios/new" style={{ opacity: '0.5' }}>
        <Card.Content>
          <Card.Header>New scenario</Card.Header>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default ScenarioListPage;
