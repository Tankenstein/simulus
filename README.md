# Simulus

A prototype crisis simulation framework for web browsers.


Simulus has been built as part of a master's thesis project. It provides common facilities for running crisis simulations in a self-contained web browser environment. It is heavily inspired by the [CRISMA project](http://www.crismaproject.eu/).


To build an application using simulus, one has to either acquire or implement simulus modules to actually provide models and model behaviour in your specific crisis simulation.

## Installing

Either through npm:

```bash
npm install simulus
```

Or by including simulus in your page using unpkg:
```html
<link rel="stylesheet" href="https://unpkg.com/simulus/dist/main.css">
<script type="text/javascript" src="https://unpkg.com/simulus/dist/main.js">
</script>
```

## Usage

Simulus is built using typescript, building your application using simulus will be easier if you also use typescript, as you will benefit from the intelligent auto-completion its type signatures enable.


To just have simulus up and running, one just has to run the simulus function (which you can either import or grab from `window` if using the cdn method of obtaining simulus) with an html element they intend to render the application into and an object defining options. For example, if one wanted to render into the document body, they could do the following:

```javascript
import simulus from 'simulus';
const options = {};
simulus(document.body, options);
```

Options consist of `routerType`, `modules` and `preloadedScenarios`.

### `routerType`

One of `'none'`, `'hash'` or `'full'`. These can also be imported as a `RouterType` enum from simulus. This defines how the client-side router of simulus in your application works. `'none'` will keep the routing state in memory only, meaning you cannot use url navigation at all. `'hash'` uses hash-based routing, allowing for url navigation without needing to support SPA-s in your web server. `'full'` uses the history api, requiring you to set up your simulus application as a full SPA.

### `modules`

In order to do anything useful with simulus, one has to either acquire and include a module, or built their own. The idea of modules is that by defining a common interface with metadata that simulation developers can use to integrate their models, developers can share and extend these pieces of functionality. Thus, a full simulus application consists of the simulus framework and included modules.

A module is a javascript object, being a collection of metadata, indicators, entity types and behaviour models, built by a user, that simulus can use to provide simulation functionality.

This is an example module:
```javascript
const ExampleModule = {
  id: ’ee.ttu.simulus.example.v1’,
  name: ’Example module’,
  description: ’Not useful module used to show how to build a module’,
};

const options = {
  modules: [ExampleModule],
};

simulus(document.body, options);
```

Then, you can include this module in a scenario when you create one via the UI. However, this module isn’t useful, it only defines the metadata of the module. Name and description are purely used for descriptive purposes, but the id is important, as it is used to see which modules scenarios are dependant on. It should be globally unique, so one can use uuid-s for this, or follow the java package convention. We also recommend appending the version to the id, if some versions of your module are not backwards compatible. Most objects with metadata in simulus require globally unique id-s.


To view a full example of a module, see the example application in the simulus repository.


Modules can provide the following resources to a simulus application:

#### Entity type (under the `entityTypes` key)

Entity types model what types of entities will be interacting in the simulation. They define metadata (name, identification, description and such) and properties of these entities. Entity types can subclass other entity types, inheriting the parents' properties in the process. This is an example entity that inherits from a vehicle entity type, where it doesn't need to define speed or location properties, instead inheriting them from the vehicle.

```javascript
const FireTruck = {
  id: ’ee.ttu.simulus.example.v1.truck’, name: ’Fire truck’,
  base
  ownProperties: [
    {
      id: ’waterRemaining’,
      name: ’Water remaining’,
      dataType: ’number’,
    }
  ],
  baseTypeId: 'ee.ttu.simulus.example.v1.vehicle',
};
```

#### Indicators (under the `indicators` key)

Indicators and behaviour models are special, in it that they expose actual javascript functions in addition to metadata. For an indicator, you first select what type of indicator it is. This denotes what kind of value will be rendered, whether this is just some value, or a graph of some kind. Once you know the type, you also have to make your indicator vector data (the return value of your indicator function) conform to that type’s standard.

#### Behaviour models (under the `models` key)

To run simulation models, one has to implement them as behaviour models in their module. First, it’s worth thinking about what data you’ll need for this simulation. If it’s not all contained in world state, it’s worth defining some simulation parameters using the parameter schema option. This will generate a form for the user to fill when they want to run a simulation, and then pass the result to the model along with the state. Finally, when you have all the data you need, you need to implement the actual simulation function. This function takes in world state and simulation parameters and passes a new state to a function, effectively performing a state transition.


If you’d like to make your model run asynchronously, you should use the `runInWorker` option instead of `run` when implementing the function. However, because of the way that we construct a worker out of the model, you cannot use variables outside of that function’s scope. This is unfortunate, but we let you also use the synchronous run if this is an issue.

