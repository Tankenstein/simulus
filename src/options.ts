import { Module } from './module';
import { Scenario } from './scenario';

/**
 * What type of router to use for your simulus instance
 */
export enum RouterType {
  /**
   * No explicit routing - state is stored in memory only.
   */
  NONE = 'none',

  /**
   * Hash routing used - useful if you cannot set up an SPA
   */
  HASH = 'hash',

  /**
   * Full routing used - need to configure your application to be an SPA
   */
  URL = 'url',
}

/**
 * Options to use to run simulus
 */
export interface Options {
  /**
   * Which type of routing to use for your simulus instance
   *
   * @default RouterType.NONE
   */
  routerType?: RouterType;

  /**
   * Which simulus modules to include in your instance
   *
   * @default []
   */
  modules?: Module[];

  /**
   * You can package some preloaded scenarios with your instance if you want to.
   *
   * @default []
   */
  preloadedScenarios?: Scenario[];
}
