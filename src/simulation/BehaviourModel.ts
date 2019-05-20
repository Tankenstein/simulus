import { JSONSchema4 } from 'json-schema';
import { EntityStateView } from '../entity';
import { RequireAtLeastOne } from 'type-fest';

export type BehaviourModel = RequireAtLeastOne<BaseBehaviourModel, 'runInWorker' | 'run'>;

export interface BaseBehaviourModel {
  id: string;
  name: string;
  parameterSchema?: JSONSchema4;
  run?: BehaviourModelRunner;
  runInWorker?: BehaviourModelRunner;
}

export type BehaviourModelRunner = (
  state: BehaviourModelState,
  parameters: any,
  callback: (state: BehaviourModelState) => any,
) => any;

export type BehaviourModelState = {
  entities: EntityStateView[];
};
