import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps, Route } from 'react-router';
import mapValues from 'lodash.mapvalues';

import { Scenario } from '../scenario';
import { keyBy } from '../utils';
import WorldStateTreeView, { WorldStateNodeType, WorldStateNode } from './WorldStateTreeView';
import WorldState from './WorldState';
import WorldStateNavigation from './WorldStateNavigation';
import WorldStateOverview from './WorldStateOverview';
import {
  EntitySection,
  useScenarioEntityTypes,
  EntityStateView,
  Entity,
  EntityType,
  EntityState,
  PropertyDataTypes,
  Property,
} from '../entity';
import { removeNodeAndRelinkChildren, createWorldState } from './worldStateServices';
import { EntityFormResult } from '../entity/EntityForm';
import {
  AnalysisSection,
  useScenarioAvailableIndicators,
  Indicator,
  defaultLayout,
} from '../analysis';
import {
  createEntity as createNewEntity,
  getEntityTypePropertyTypes,
  getDefaultValueForPropertyDataType,
} from '../entity/entityServices';
import { copy, Dict } from '../utils';
import {
  SimulationSection,
  useScenarioBehaviourModels,
  createWorker,
  BehaviourModel,
} from '../simulation';
import { Layout } from 'react-grid-layout';

type Transition = {
  previousWorldStateId?: string;
  entityStates: Dict<EntityState>;
};

/**
 * Main view of a single world state and world state navigation
 * @param param0 Props
 */
const WorldStatesView = ({
  scenario,
  isTransition,
  activeWorldStateId,
  previousWorldStateId,
  onEditScenario: editScenario,
  history,
}: {
  scenario: Scenario;
  isTransition: boolean;
  onEditScenario: (edit: Partial<Scenario>) => any;
  activeWorldStateId?: string;
  previousWorldStateId?: string;
} & RouteComponentProps) => {
  const [simulating, setSimulating] = useState(false);
  const entityTypes = useScenarioEntityTypes(scenario);
  const behaviourModels = useScenarioBehaviourModels(scenario);
  const availableIndicators = useScenarioAvailableIndicators(scenario);
  const entitiesById = keyBy(scenario.entities, 'id');
  const worldStatesById = keyBy(scenario.worldStates, 'id');
  const combinedIndicators = scenario.indicatorIds.map(id => availableIndicators[id]);
  const indicatorsById = keyBy(combinedIndicators, 'id');
  const [transition, setTransition] = useState<Transition>(rebuildTransition());
  const activeWorldState = activeWorldStateId ? worldStatesById[activeWorldStateId] : undefined;

  useEffect(() => {
    setTransition(rebuildTransition());
  }, [activeWorldState, previousWorldStateId]);

  const worldStateNodes = buildWorldStateNodes(scenario.worldStates);
  const worldStateNodesWithTransition = isTransition
    ? [...worldStateNodes, buildTransitionNode(previousWorldStateId)]
    : worldStateNodes;
  const baseUrl = worldStateUrl(activeWorldStateId ? activeWorldStateId : 'new');

  const entityStateViews = buildEntityStateViews({
    entities: scenario.entities,
    entityTypes,
    entityStates: transition.entityStates,
  });

  function worldStateUrl(id: string): string {
    return `/scenarios/${scenario.id}/ws/${id}`;
  }

  function rebuildTransition(): Transition {
    let entityStates;
    if (activeWorldState) {
      entityStates = activeWorldState.entityStates;
    } else if (previousWorldStateId) {
      entityStates = copy(worldStatesById[previousWorldStateId]).entityStates;
    }
    if (!entityStates) {
      entityStates = buildDefaultEntityStates();
    }
    return {
      previousWorldStateId,
      entityStates,
    };
  }

  function buildDefaultEntityStates(): Dict<EntityState> {
    return scenario.entities.reduce((acc, current) => {
      const entityType = entityTypes[current.typeId];
      const propertyTypes = getEntityTypePropertyTypes(entityType, entityTypes);
      const newState: EntityState = {
        entityId: current.id,
        properties: mapValues(propertyTypes, type => ({
          typeId: type.id,
          value: getDefaultValueForPropertyDataType(type.dataType),
        })) as Dict<Property>,
      };
      return {
        ...acc,
        [current.id]: newState,
      };
    }, {});
  }

  async function deleteWorldState(state: WorldState) {
    if (!state.previousWorldStateId) {
      return; // cannot delete first state.
    }
    const worldStates = removeNodeAndRelinkChildren(scenario.worldStates, state);
    await editScenario({ worldStates });
    history.push(worldStateUrl(state.previousWorldStateId));
  }

  async function commitTransition() {
    const state = createWorldState(transition);
    await editScenario({ worldStates: scenario.worldStates.concat([state]) });
    history.push(worldStateUrl(state.id));
  }

  async function createEntity(entityFormResult: EntityFormResult) {
    // first, update entities.
    const entityType = entityTypes[entityFormResult.typeId];
    const newEntity = createNewEntity({
      typeId: entityFormResult.typeId,
      name: entityFormResult.name || `Generic ${entityType.name}`,
    });
    const entities = [...scenario.entities, newEntity];
    // now, create properties for it in the transition
    const newEntityStates: Dict<EntityState> = {
      ...transition.entityStates,
      [newEntity.id]: buildEntityState({
        id: newEntity.id,
        propertyValues: entityFormResult.propertyValues,
        entityType,
      }),
    };

    setTransition({ ...transition, entityStates: newEntityStates });
    await editScenario({ entities });
  }

  async function editEntity(entityFormResult: EntityFormResult) {
    if (!entityFormResult.id) {
      return null;
    }
    // first, update entities (for names and such).
    const entities = updateEntities(scenario.entities, entityFormResult);
    // now, update properties in the transition
    const newEntityStates: Dict<EntityState> = {
      ...transition.entityStates,
      [entityFormResult.id]: buildEntityState({
        id: entityFormResult.id,
        propertyValues: entityFormResult.propertyValues,
        entityType: entityTypes[entityFormResult.typeId],
      }),
    };
    setTransition({ ...transition, entityStates: newEntityStates });
    await editScenario({ entities });
  }

  function buildEntityState({
    id,
    propertyValues,
    entityType,
  }: {
    id: string;
    entityType: EntityType;
    propertyValues: Dict<PropertyDataTypes>;
  }): EntityState {
    const propertyTypes = getEntityTypePropertyTypes(entityType, entityTypes);
    return {
      entityId: id,
      properties: mapValues(propertyTypes, value => ({
        typeId: value.id,
        value: propertyValues[value.id],
      })),
    } as EntityState; // NOTE: for some reason, it refues to accept that propertyValues[value.id] is a PropertyDataTypes instance
  }

  async function toggleEntityArchived(entity: EntityStateView) {
    const entities = updateEntities(scenario.entities, {
      id: entity.id,
      archived: !entity.archived,
      typeId: entity.type.id,
      propertyValues: mapValues(entity.properties, entity => entity.value),
    });
    editScenario({ entities });
  }

  async function runSimulation(model: BehaviourModel, params?: any) {
    const worker = createWorker(model);
    setSimulating(true);
    const result = await worker({ entities: entityStateViews }, params || {});
    setSimulating(false);
    const newEntityStates: EntityState[] = result.entities.map(entity => ({
      entityId: entity.id,
      properties: mapValues(
        entity.properties,
        value =>
          ({
            typeId: value.type.id,
            value: value.value,
          } as Property),
      ),
    }));
    // let's add new entities if they don't exist yet.
    const newEntities = result.entities.filter(entity => !entitiesById[entity.id]);
    await editScenario({
      entities: scenario.entities.concat(
        newEntities.map(entity => ({
          ...entity,
          typeId: entity.type.id,
        })),
      ),
    });
    // now update transition
    setTransition({
      entityStates: keyBy(newEntityStates, 'entityId'),
    });
  }

  async function createIndicator(indicator: Indicator) {
    indicatorsById[indicator.id] = indicator;
    const indicatorValues = Object.values(indicatorsById);
    await editScenario({
      indicatorIds: Object.keys(indicatorsById),
      indicatorLayout: defaultLayout(indicatorValues),
    });
  }

  async function deleteIndicator(indicator: Indicator) {
    delete indicatorsById[indicator.id];
    const indicatorValues = Object.values(indicatorsById);
    await editScenario({
      indicatorIds: Object.keys(indicatorsById),
      indicatorLayout: defaultLayout(indicatorValues),
    });
  }

  async function saveLayout(layout: Layout[]) {
    await editScenario({ indicatorLayout: layout });
  }

  const exactRoute = (url: string, renderFunc: () => React.ReactNode) => (
    <Route path={url} exact render={renderFunc} />
  );

  return (
    <>
      <WorldStateTreeView
        nodes={worldStateNodesWithTransition}
        onSelectState={(id: string) => history.push(`/scenarios/${scenario.id}/ws/${id}`)}
      />
      <WorldStateNavigation baseUrl={baseUrl} />

      {exactRoute(baseUrl, () => (
        <WorldStateOverview
          scenarioId={scenario.id}
          worldState={activeWorldState}
          onCommitTransition={commitTransition}
          onDeleteState={
            activeWorldState && activeWorldState.previousWorldStateId ? deleteWorldState : undefined
          }
        />
      ))}

      {exactRoute(`${baseUrl}/entities`, () => (
        <EntitySection
          entities={entityStateViews}
          entityTypes={entityTypes}
          mutable={isTransition}
          onCreateEntity={createEntity}
          onEditEntity={editEntity}
          onToggleEntityArchived={toggleEntityArchived}
        />
      ))}

      {exactRoute(`${baseUrl}/simulation`, () => (
        <SimulationSection
          simulating={simulating}
          behaviourModels={behaviourModels}
          onSimulate={isTransition ? runSimulation : undefined}
        />
      ))}

      {exactRoute(`${baseUrl}/analysis`, () => (
        <AnalysisSection
          availableIndicators={availableIndicators}
          entityStates={entityStateViews}
          indicators={indicatorsById}
          layout={scenario.indicatorLayout}
          onCreateIndicator={createIndicator}
          onDeleteIndicator={deleteIndicator}
          onSaveLayout={saveLayout}
        />
      ))}
    </>
  );
};

function buildEntityStateViews({
  entities,
  entityStates,
  entityTypes,
}: {
  entities: Entity[];
  entityStates: Dict<EntityState>;
  entityTypes: Dict<EntityType>;
}): EntityStateView[] {
  return entities
    .filter(entity => entityStates[entity.id]) // since states do not exist, these entities were not present at that point
    .map(entity => {
      const entityType = entityTypes[entity.typeId];
      const propertyTypes = getEntityTypePropertyTypes(entityType, entityTypes); // NOTE: we should be able to optimise this, we use it everywhere
      const { properties } = entityStates[entity.id];
      return {
        ...entity,
        type: entityType,
        properties: mapValues(properties, property => ({
          ...property,
          type: propertyTypes[property.typeId],
        })),
      };
    });
}

function buildTransitionNode(previousWorldStateId?: string): WorldStateNode {
  return {
    type: WorldStateNodeType.TRANSITION,
    previousWorldStateId,
  };
}

function buildWorldStateNodes(states: WorldState[]): WorldStateNode[] {
  return states.map(state => ({
    id: state.id,
    type: WorldStateNodeType.STATE,
    previousWorldStateId: state.previousWorldStateId,
  }));
}

function updateEntities(entities: Entity[], result: EntityFormResult): Entity[] {
  if (result.id) {
    return entities.map(entity => {
      if (entity.id === result.id) {
        return {
          ...entity,
          name: result.name || entity.name,
          archived: typeof result.archived !== 'undefined' ? result.archived : entity.archived,
        };
      }
      return entity;
    });
  }
  return entities;
}

export default withRouter(WorldStatesView);
