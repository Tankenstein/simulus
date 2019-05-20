import React from 'react';
import { Card, Header, Message, Label, Popup } from 'semantic-ui-react';

import { useModules } from './ModuleContext';
import { getEntityTypePropertyTypes } from '../entity/entityServices';
import { keyBy } from '../utils';

/**
 * Page that lists currently loaded modules.
 */
const ModulesPage = () => {
  const modules = Object.values(useModules());
  return (
    <>
      <Header as="h2" style={{ marginTop: '8px' }}>
        Loaded modules
      </Header>
      {!modules.length && (
        <Message negative>
          <Message.Header>You have no loaded modules.</Message.Header>
          <p>
            Simulus is not useful unless you preload it with some simulus modules. TODO link to docs
            here
          </p>
        </Message>
      )}
      <Card.Group itemsPerRow={3} doubling stackable>
        {modules.map(module => (
          <Card key={module.id}>
            <Card.Content>
              <Card.Header>{module.name}</Card.Header>
              <Card.Meta>{module.id}</Card.Meta>
            </Card.Content>
            <Card.Content>
              <Card.Description>{module.description}</Card.Description>
            </Card.Content>
            {module.entityTypes ? (
              <Card.Content>
                <Card.Description>
                  <p>Entity Types</p>
                  <Label.Group>
                    {module.entityTypes.map(type => (
                      <Popup key={type.id} trigger={<Label>{type.name}</Label>}>
                        <Popup.Header>{type.name} properties</Popup.Header>
                        <Popup.Content>
                          <Label.Group>
                            {Object.values(
                              getEntityTypePropertyTypes(type, keyBy(module.entityTypes, 'id')),
                            ).map(property => (
                              <Label key={property.id}>{property.name}</Label>
                            ))}
                          </Label.Group>
                        </Popup.Content>
                      </Popup>
                    ))}
                  </Label.Group>
                </Card.Description>
              </Card.Content>
            ) : (
              ''
            )}
          </Card>
        ))}
      </Card.Group>
    </>
  );
};

export default ModulesPage;
