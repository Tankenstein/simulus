import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router';
import { Grid, GridColumn } from 'semantic-ui-react';

import ScenarioForm from '../ScenarioForm';
import * as ScenarioRepository from '../ScenarioRepository';
import { useModules } from '../../module';

/**
 * Page that lets you create scenarios.
 */
const NewScenarioPage = () => {
  const [done, setDone] = useState(false);
  const modules = useModules();

  async function saveScenario(params: ScenarioRepository.ScenarioParams) {
    await ScenarioRepository.create(params);
    setDone(true);
  }

  if (done) {
    return <Redirect push to="/scenarios" />;
  }

  return (
    <Grid centered style={{ marginTop: '16px' }}>
      <GridColumn width={8}>
        <ScenarioForm onSubmit={saveScenario} availableModules={modules} />
      </GridColumn>
    </Grid>
  );
};

export default NewScenarioPage;
