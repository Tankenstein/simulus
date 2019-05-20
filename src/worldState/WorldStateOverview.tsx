import React from 'react';
import { Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import WorldState from './WorldState';

const WorldStateOverview = ({
  onCommitTransition,
  onDeleteState,
  worldState,
  scenarioId,
}: {
  worldState?: WorldState;
  scenarioId?: string;
  onCommitTransition?: () => any;
  onDeleteState?: (state: WorldState) => any;
}) =>
  worldState ? (
    <>
      <Header as="h2">State {worldState.id}</Header>
      <Button
        primary
        as={Link}
        to={`/scenarios/${scenarioId}/ws/new?transitionFrom=${encodeURIComponent(worldState.id)}`}
      >
        Transition to new state
      </Button>
      {onDeleteState ? (
        <Button color="red" onClick={() => onDeleteState(worldState)}>
          Delete state
        </Button>
      ) : (
        ''
      )}
    </>
  ) : (
    <>
      <Header as="h2">New world state</Header>
      <p>
        You can edit the state or run simulations, then commit the transition when you want to save
        a new state.
      </p>
      <Button primary onClick={onCommitTransition ? onCommitTransition : undefined}>
        Commit transition
      </Button>
    </>
  );

export default WorldStateOverview;
