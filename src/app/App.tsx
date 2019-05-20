import React from 'react';
import { Link, NavLink, Switch, Route } from 'react-router-dom';
import { Container, Menu, Divider, Header } from 'semantic-ui-react';
import { ModulesPage } from '../module';
import { ScenarioListPage, NewScenarioPage, ScenarioPage } from '../scenario';
import IntroductionPage from './IntroductionPage';

/**
 * Main application component of simulus.
 */
const App = () => (
  <Container style={{ marginTop: '32px', minHeight: '150vh' }}>
    <Menu secondary as="header">
      <Menu.Item as={Link} to="/">
        <Header as="h3">Simulus</Header>
      </Menu.Item>
      <Menu.Item as={NavLink} to="/scenarios" exact>
        Scenarios
      </Menu.Item>
      <Menu.Item as={NavLink} to="/modules" exact>
        Modules
      </Menu.Item>
    </Menu>
    <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
    <Switch>
      <Route exact path="/" render={() => <IntroductionPage />} />
      <Route exact path="/modules" render={() => <ModulesPage />} />
      <Route exact path="/scenarios" render={() => <ScenarioListPage />} />
      <Route exact path="/scenarios/new" render={() => <NewScenarioPage />} />
      <Route
        path="/scenarios/:id"
        render={({
          match: {
            params: { id },
          },
        }) => <ScenarioPage id={id} />}
      />
    </Switch>
  </Container>
);

export default App;
