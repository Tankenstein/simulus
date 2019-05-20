import uuid from 'uuid/v4';
import WorldState from './WorldState';
import { EntityState } from '../entity';
import Dict from '../utils/Dict';

/**
 * Utility for creating new world states.
 * @param param0 Paramters of the world state.
 */
export function createWorldState({
  previousWorldStateId,
  entityStates,
}: {
  previousWorldStateId?: string;
  entityStates: Dict<EntityState>;
}): WorldState {
  return {
    id: uuid(),
    createdAt: new Date(),
    previousWorldStateId,
    entityStates,
  };
}

/**
 * Given an array of world states and a single world state, relink all nodes pointing to the given node to the parent of that node.
 * Returns the new states.
 * @param states World state to operate on
 * @param node The node to remove
 */
export function removeNodeAndRelinkChildren(states: WorldState[], node: WorldState): WorldState[] {
  return states
    .filter(state => state.id !== node.id)
    .map(state => ({
      ...state,
      previousWorldStateId:
        state.previousWorldStateId === node.id
          ? node.previousWorldStateId
          : state.previousWorldStateId,
    }));
}
