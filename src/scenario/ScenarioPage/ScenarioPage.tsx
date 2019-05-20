import React from 'react';
import { RouteComponentProps, withRouter, Route, Redirect } from 'react-router';
import { useScenario } from '../scenarioHooks';
import ScenarioOverview from './ScenarioOverview';
import { update, remove } from '../ScenarioRepository';
import Scenario from '../Scenario';
import { WorldStatesView, WorldState, worldStateServices as stateServices } from '../../worldState';

/**
 * Main page of simulus, where you're acting on a scenario
 * @param param0 props
 */
const ScenarioPage = ({ id, history, match }: { id: string } & RouteComponentProps) => {
  const { scenario, reload } = useScenario(id);

  if (!scenario) {
    return <></>;
  }

  function goToScenarioList() {
    history.push('/scenarios');
    return <></>;
  }

  async function editScenario(edit: Partial<Scenario>) {
    await update({
      ...scenario,
      ...(edit as Scenario),
    });
    reload();
  }

  async function deleteScenario(id: string) {
    await remove(id);
    goToScenarioList();
  }

  return (
    <>
      <ScenarioOverview
        scenario={scenario}
        onEditScenario={editScenario}
        onDeleteScenario={deleteScenario}
      />
      <Route path={`${match.url}/ws/:id`}>
        {({ match: worldStateMatch, location }) => {
          if (!worldStateMatch) {
            return <Redirect to={`${match.url}/ws/new`} />;
          }
          const { id } = worldStateMatch.params;
          const isTransition = id === 'new';
          const urlParams = new URLSearchParams(location.search);
          const branchedFromWorldStateId = urlParams.get('transitionFrom') as string | undefined;
          const isFirstState = isTransition && !branchedFromWorldStateId;
          if (isFirstState && scenario.worldStates.length) {
            // invalid state, let's go to somewhere we can recover from.
            return <Redirect to={`${match.url}/ws/${scenario.worldStates[0].id}`} />;
          }
          return (
            <WorldStatesView
              scenario={scenario}
              isTransition={isTransition}
              activeWorldStateId={!isTransition ? id : undefined}
              previousWorldStateId={branchedFromWorldStateId}
              onEditScenario={editScenario}
            />
          );
        }}
      </Route>
    </>
  );
};

export default withRouter(ScenarioPage);

/*

interface ScenarioPageProps {
  id: string;
}
const ScenarioPage = ({
  id: scenarioId,
  history,
  match,
}: ScenarioPageProps & RouteComponentProps) => {
  const { loading, scenario, setScenario } = ScenarioRepository.useScenario(scenarioId);

  function editScenario(editedScenario: Scenario) {
    setScenario(editedScenario);
    ScenarioRepository.update(editedScenario);
  }

  async function deleteScenario(id: string) {
    await ScenarioRepository.remove(id);
    history.push('/scenarios');
  }

  return (
    <>
      <ScenarioOverview
        loading={loading}
        scenario={scenario}
        onEditScenario={editScenario}
        onDeleteScenario={deleteScenario}
      />
      {scenario ? (
        <Route path={`${match.url}/ws/:id`}>
          {({ match: worldStateMatch, location, history }) => {
            if (!worldStateMatch) {
              return <Redirect to={`${match.url}/ws/new`} />;
            }
            const { id } = worldStateMatch.params;
            const isNewState = id === 'new';
            const urlParams = new URLSearchParams(location.search);
            const branchedFromWorldStateId: string | null = urlParams.get('transitionFrom');
            return (
              <WorldStatesView
                scenario={scenario}
                branchedFromWorldStateId={branchedFromWorldStateId || undefined}
                isNewState={isNewState}
                id={isNewState ? undefined : id}
                history={history}
              />
            );
          }}
        </Route>
      ) : (
        ''
      )}
    </>
  );
};*/
