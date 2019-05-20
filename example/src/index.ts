import simulus, { Options } from 'simulus';
import 'simulus/dist/main.css';
import * as serviceWorker from './serviceWorker';

import Ambusim from './ambusim';

simulus(document.getElementById('root')!, {
  routerType: Options.RouterType.HASH,
  modules: [Ambusim],
});

serviceWorker.register({});
