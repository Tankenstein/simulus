import { BehaviourModel, BehaviourModelState } from './BehaviourModel';
import { copy } from '../utils';
import { spawnWorker } from '../infrastructure';

export type SimulationWorker = (
  state: BehaviourModelState,
  params: any,
) => Promise<BehaviourModelState>;

export function createWorker(model: BehaviourModel): SimulationWorker {
  return (state: BehaviourModelState, params: any) =>
    new Promise(resolve => {
      const stateCopy = copy(state);
      const anyModel = model as any; // we use a hacky "at least one required" type here for consumers
      if (anyModel.runInWorker) {
        const worker = spawnWorker(anyModel.runInWorker);
        worker(stateCopy, params, (...results: any) => {
          worker.destroy();
          resolve(...results);
        });
      } else {
        anyModel.run(stateCopy, params, resolve);
      }
    });
}
