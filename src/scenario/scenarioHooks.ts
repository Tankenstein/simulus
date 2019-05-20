import { useAsyncResource } from '../utils';
import { findAll, findById } from './ScenarioRepository';
import Scenario from './Scenario';
import { useModules } from '../module';

/**
 * A react hook to easily consume scenarios
 */
export function useScenarios() {
  const { loading, resource, reload, error } = useAsyncResource(findAll);
  return { loading, reload, scenarios: resource, error };
}

/**
 * A react hook to easily consume a single scenario
 * @param id Id of the scenario to load
 */
export function useScenario(id: string) {
  const { loading, resource, reload, error } = useAsyncResource(() => findById(id), [id]);
  return { loading, reload, scenario: resource, error };
}

/**
 * A react hook to easily consume modules available to a scenario
 * @param scenario Scenario to get modules for
 */
export function useScenarioModules(scenario: Scenario) {
  const modulesById = useModules();
  return scenario.moduleIds.map(id => modulesById[id]);
}
