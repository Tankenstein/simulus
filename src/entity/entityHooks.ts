import { Scenario, useScenarioModules } from '../scenario';
import { keyBy } from '../utils';
import Dict from '../utils/Dict';
import { EntityType } from '.';
import { useMemo } from 'react';

export function useScenarioEntityTypes(scenario: Scenario): Dict<EntityType> {
  const modules = useScenarioModules(scenario);
  return useMemo(() => keyBy(modules.flatMap(module => module.entityTypes || []), 'id'), [
    scenario.id, // we know entity types will not change, except when scenarios change.
  ]);
}
