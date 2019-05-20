import { useScenarioModules, Scenario } from '../scenario';
import { Dict, keyBy } from '../utils';
import { Indicator } from './Indicator';

export function useScenarioAvailableIndicators(scenario: Scenario): Dict<Indicator> {
  const modules = useScenarioModules(scenario);
  const indicators = modules.flatMap(module => module.indicators || []);
  return keyBy(indicators, 'id');
}
