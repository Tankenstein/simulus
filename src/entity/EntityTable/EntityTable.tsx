import React, { ReactNode, useState } from 'react';
import { Button, Icon, Menu, Table } from 'semantic-ui-react';
import { chunk } from '../../utils';
import { EntityStateView } from '../EntityStateView';
import PropertyDisplay from './PropertyDisplay';

const PAGE_SIZE = 10;

const EntityTable = ({
  entities,
  footerContent,
  onToggleEntityArchived,
  onEditEntity,
}: {
  entities: EntityStateView[];
  footerContent?: ReactNode;
  onToggleEntityArchived?: (entity: EntityStateView) => any;
  onEditEntity?: (entity: EntityStateView) => any;
}) => {
  const [activePage, setPage] = useState(0);
  const entitiesInPages = chunk(entities, PAGE_SIZE);
  const isFirstPage = activePage === 0;
  const isLastPage = activePage === entitiesInPages.length - 1;
  return (
    <Table basic>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Properties</Table.HeaderCell>
          <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {entitiesInPages[activePage].map(entity => (
          <Table.Row key={entity.id}>
            <Table.Cell>{entity.name}</Table.Cell>
            <Table.Cell>{entity.type.name}</Table.Cell>
            <Table.Cell>
              {Object.values(entity.properties).map(property => (
                <PropertyDisplay key={property.type.id} property={property} />
              ))}
            </Table.Cell>

            <Table.Cell textAlign="right">
              {onEditEntity ? <Button onClick={() => onEditEntity(entity)}>Edit</Button> : ''}
              {onToggleEntityArchived ? (
                <Button
                  color={entity.archived ? 'green' : 'yellow'}
                  onClick={() => onToggleEntityArchived(entity)}
                >
                  {entity.archived ? 'Unarchive' : 'Archive'}
                </Button>
              ) : (
                ''
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          {footerContent ? <Table.HeaderCell colSpan="2">{footerContent}</Table.HeaderCell> : ''}
          <Table.HeaderCell colSpan={footerContent ? '2' : '4'} verticalAlign="top">
            <Menu floated="right" pagination>
              <Menu.Item
                as="a"
                icon
                onClick={() => setPage(previous => previous - 1)}
                disabled={isFirstPage}
              >
                <Icon name="chevron left" />
              </Menu.Item>
              {entitiesInPages.map((_, page) => (
                <Menu.Item
                  key={page}
                  as="a"
                  active={activePage === page}
                  onClick={() => setPage(page)}
                >
                  {page + 1}
                </Menu.Item>
              ))}
              <Menu.Item
                as="a"
                icon
                onClick={() => setPage(previous => previous + 1)}
                disabled={isLastPage}
              >
                <Icon name="chevron right" />
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default EntityTable;
