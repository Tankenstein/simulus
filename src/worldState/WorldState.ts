import { EntityState } from '../entity';
import Dict from '../utils/Dict';

export default interface WorldState {
  id: string;
  createdAt: Date;
  previousWorldStateId?: string;
  entityStates: Dict<EntityState>;
}
