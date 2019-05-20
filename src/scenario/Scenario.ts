import { Entity } from '../entity';
import { WorldState } from '../worldState';
import { Layout } from 'react-grid-layout';

export default interface Scenario {
  id: string;
  name: string;
  createdAt: Date;
  moduleIds: ModuleId[];
  entities: Entity[]; // if performance suffers, we should move out entities and world states into their own repos.
  worldStates: WorldState[];
  indicatorIds: IndicatorId[];
  indicatorLayout: Layout[];
}

export type ModuleId = string;
export type IndicatorId = string;
