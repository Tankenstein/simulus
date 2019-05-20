import { BehaviourModel } from './BehaviourModel';
import { Scenario, useScenarioModules } from '../scenario';
import { keyBy, Dict } from '../utils';

/**
 * Simple hook that lets you access all behaviour models available in a scenario.
 * @param scenario Scenario to get behaviour models for
 */
export function useScenarioBehaviourModels(scenario: Scenario): Dict<BehaviourModel> {
  const modules = useScenarioModules(scenario);
  return keyBy(modules.flatMap(module => module.models || []), 'id');
}
