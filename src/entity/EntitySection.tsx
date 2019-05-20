import React, { useState } from 'react';
import { Header, Message, Button, Modal, Grid, GridColumn } from 'semantic-ui-react';

import EntityForm, { EntityFormResult } from './EntityForm';
import EntityTable from './EntityTable';
import { EntityStateView } from './EntityStateView';
import Dict from '../utils/Dict';
import { EntityType } from '.';

type FormMode = 'editing' | 'adding' | 'none';
type BaseFormState<T extends FormMode> = {
  mode: T;
};
type FormState =
  | BaseFormState<'adding'>
  | BaseFormState<'none'>
  | BaseFormState<'editing'> & { entity: EntityStateView };

const EntitySection = ({
  entities,
  onCreateEntity,
  onEditEntity,
  onToggleEntityArchived,
  entityTypes,
  mutable,
}: {
  entities: EntityStateView[];
  entityTypes: Dict<EntityType>;
  onEditEntity: (entity: EntityFormResult) => any;
  onCreateEntity: (entity: EntityFormResult) => any;
  onToggleEntityArchived: (entityId: EntityStateView) => any;
  mutable: boolean;
}) => {
  const [filters, setFilters] = useState({ showArchived: false });
  const [formState, setFormState] = useState<FormState>({ mode: 'none' });
  const closeForm = () => setFormState({ mode: 'none' });
  const filteredEntities = entities.filter(entity => filters.showArchived || !entity.archived);
  return (
    <>
      <Grid doubling>
        <GridColumn width="8">
          <Header as="h2">Entities</Header>
        </GridColumn>
        <GridColumn width="8" floated="right" textAlign="right">
          <Button
            onClick={() =>
              setFilters(oldFilters => ({ ...oldFilters, showArchived: !oldFilters.showArchived }))
            }
          >
            {filters.showArchived ? 'Hide archived' : 'Show archived'}
          </Button>
        </GridColumn>
      </Grid>
      {filteredEntities.length ? (
        <EntityTable
          entities={filteredEntities}
          onToggleEntityArchived={entity => onToggleEntityArchived(entity)}
          onEditEntity={mutable ? entity => setFormState({ entity, mode: 'editing' }) : undefined}
          footerContent={
            <Button primary onClick={() => setFormState({ mode: 'adding' })} disabled={!mutable}>
              {mutable ? 'Add an entity' : 'Create a transition to change entities'}
            </Button>
          }
        />
      ) : (
        <Message>
          <Message.Header>No entities found</Message.Header>
          <Message.Content style={{ marginTop: '16px' }}>
            {filteredEntities.length !== entities.length ? (
              <>
                <p>However, there are some archived entities.</p>
                <Button onClick={() => setFilters({ showArchived: true })}>
                  Show archived entities
                </Button>
              </>
            ) : (
              ''
            )}
            <Button primary onClick={() => setFormState({ mode: 'adding' })} disabled={!mutable}>
              {mutable ? 'Add an entity' : 'Create a transition to change entities'}
            </Button>
          </Message.Content>
        </Message>
      )}

      <Modal open={formState.mode !== 'none'} onClose={closeForm} size="small">
        <Modal.Content>
          <EntityForm
            initialValue={formState.mode === 'editing' ? formState.entity : undefined}
            entityTypes={entityTypes}
            onSubmit={formResult => {
              if (formState.mode === 'editing') {
                onEditEntity(formResult);
              } else if (formState.mode === 'adding') {
                onCreateEntity(formResult);
              }
              closeForm();
            }}
            onCancel={closeForm}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default EntitySection;
