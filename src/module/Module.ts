import { EntityType } from '../entity';
import { BehaviourModel } from '../simulation';
import { Indicator } from '../analysis';

/**
 * Represents a 'module' which is a user-defined bundle of resources for running simulations.
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  entityTypes?: EntityType[];
  models?: BehaviourModel[];
  indicators?: Indicator[];
}
