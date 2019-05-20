import Dexie from 'dexie';
import uuid from 'uuid/v4';

import { database } from '../infrastructure';
import Scenario, { ModuleId } from './Scenario';

const table: Dexie.Table<Scenario, string> = database.table('scenarios');

/**
 * Find all scenarios
 */
export async function findAll(): Promise<Scenario[]> {
  return table.toArray();
}

/**
 * Find a single scenario by id
 * @param id Scenario id to find
 */
export async function findById(id: string): Promise<Scenario | undefined> {
  return table.get(id);
}

/**
 * Delete a scenario and all associated data
 * @param id Scenario id to remove
 */
export async function remove(id: string) {
  return table.delete(id);
}

/**
 *  Update a scenario
 * @param scenario Updated scenario
 */
export async function update(scenario: Scenario) {
  await table.update(scenario.id, scenario);
  return scenario;
}

/**
 * Parameters to create a scenario
 */
export interface ScenarioParams {
  name: string;
  moduleIds: ModuleId[];
}

/**
 * Create a new scenario
 * @param param0 Parameters to create a scenario
 */
export async function create({ name, moduleIds }: ScenarioParams): Promise<Scenario> {
  const scenario = {
    id: uuid(),
    name,
    createdAt: new Date(),
    moduleIds,
    entities: [],
    worldStates: [],
    indicatorIds: [],
    indicatorLayout: [],
  };

  await table.add(scenario);
  return scenario;
}
