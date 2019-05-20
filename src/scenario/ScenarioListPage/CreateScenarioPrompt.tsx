import React from 'react';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

/**
 * Placeholder to be used when no scenarios have been created yet
 */
const CreateScenarioPrompt = () => (
  <Segment placeholder>
    <Header icon>
      <Icon name="eye" />
      To get started, create your first scenario below.
    </Header>
    <Segment.Inline>
      <Button primary as={Link} to="/scenarios/new">
        Create scenario
      </Button>
    </Segment.Inline>
  </Segment>
);

export default CreateScenarioPrompt;
