import { createContext, useContext } from 'react';

import { Module } from './Module';
import { Dict } from '../utils';

const context = createContext<Dict<Module>>({});

/**
 * React hook that gives access to currently loaded modules
 */
export const useModules = () => useContext(context);

/**
 * Context provider where you can provide modules
 */
export const Provider = context.Provider;
