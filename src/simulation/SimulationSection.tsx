import React, { useState } from 'react';
import JsonSchemaForm from 'react-jsonschema-form-semanticui';
import { Header, Form, Message, Dropdown, Button } from 'semantic-ui-react';
import { Dict } from '../utils';
import { BehaviourModel } from './BehaviourModel';

const SimulationSection = ({
  behaviourModels,
  onSimulate,
  simulating,
}: {
  behaviourModels: Dict<BehaviourModel>;
  onSimulate?: (model: BehaviourModel, simulationParameters: any) => any;
  simulating?: boolean;
}) => {
  const [params, setParams] = useState<any>({});
  const [selectedModelId, setSelectedModelId] = useState<string>();
  const selectedModel = behaviourModels[selectedModelId as string];
  const canSimulate = !!onSimulate;
  const modelValues = Object.values(behaviourModels);
  const canRun = !!selectedModel;
  return (
    <>
      <Header as="h2">Simulation</Header>

      {canSimulate ? (
        <Form
          loading={simulating}
          onSubmit={event => {
            event.preventDefault();
            if (onSimulate) {
              onSimulate(selectedModel, params);
              setSelectedModelId(undefined);
            }
          }}
        >
          {modelValues.length ? (
            <Form.Field>
              <label htmlFor="simulation-model">Select model</label>
              <Dropdown
                id="simulation-model"
                fluid
                selection
                options={modelValues.map(model => ({
                  key: model.id,
                  value: model.id,
                  text: model.name,
                }))}
                value={selectedModelId}
                onChange={(_, { value }) => setSelectedModelId(value as string)}
              />
            </Form.Field>
          ) : (
            <Message color="red">
              <Message.Header>Can't run simulations.</Message.Header>
              <Message.Content style={{ marginTop: '8px' }}>
                You need to include modules with simulation models to run.
              </Message.Content>
            </Message>
          )}
          {selectedModel && selectedModel.parameterSchema ? (
            <>
              <Header as="h3">Simulation parameters</Header>
              <JsonSchemaForm
                schema={selectedModel.parameterSchema}
                formData={params}
                onChange={({ formData }: any) => setParams(formData)}
              >
                <div />
              </JsonSchemaForm>
            </>
          ) : (
            ''
          )}
          <Button type="submit" primary disabled={!canRun}>
            Run
          </Button>
        </Form>
      ) : (
        <Message>
          <Message.Header>Can't run simulations on existing states.</Message.Header>
          <Message.Content style={{ marginTop: '8px' }}>
            You need to branch into a new world state to run a simulation.
          </Message.Content>
        </Message>
      )}
    </>
  );
};

export default SimulationSection;
