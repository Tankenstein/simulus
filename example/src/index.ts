import simulus, { Options } from 'simulus';
import 'simulus/dist/main.css';
import * as serviceWorker from './serviceWorker';

import Ambusim from './ambusim';
import exampleScenario from './exampleScenario.json';

simulus(document.getElementById('root')!, {
  routerType: Options.RouterType.HASH,
  modules: [Ambusim],
  preloadedScenarios: [exampleScenario as any],
});

serviceWorker.register({});

