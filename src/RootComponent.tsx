import React, { StrictMode, useMemo, useEffect } from 'react';
import { MemoryRouter } from 'react-router';
import { HashRouter, BrowserRouter } from 'react-router-dom';

import { Options, RouterType } from './options';
import { Provider as ModuleProvider } from './module';
import { ScenarioRepository } from './scenario';
import App from './app';
import { keyBy } from './utils';

/**
 * Root react component that runs simulus
 * @param param0 Props
 */
const RootComponent = ({ options }: { options: Options }) => {
  const Router = getRouterInstanceForType(options.routerType);
  const modules = useMemo(() => keyBy(options.modules, 'id'), [options.modules]);
  useEffect(() => {
    if (options.preloadedScenarios) {
      options.preloadedScenarios.forEach(ScenarioRepository.saveIfDoesNotExist);
    }
  }, [options.preloadedScenarios]);
  return (
    <StrictMode>
      <ModuleProvider value={modules}>
        <Router>
          <App />
        </Router>
      </ModuleProvider>
    </StrictMode>
  );
};

type Router = React.ComponentClass<any>;
function getRouterInstanceForType(type?: RouterType): Router {
  switch (type) {
    case RouterType.HASH:
      return HashRouter;
    case RouterType.URL:
      return BrowserRouter;
    case RouterType.NONE:
    default:
      return MemoryRouter;
  }
}

export default RootComponent;
