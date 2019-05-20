import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

/**
 * Handles navigating inside a world state view
 * @param param0 props
 */
const WorldStateNavigation = ({ baseUrl, location }: { baseUrl: string } & RouteComponentProps) => {
  const urlPreservingQuery = (url: string) => ({ pathname: url, search: location.search });
  return (
    <Menu tabular secondary pointing style={{ marginBottom: '32px' }}>
      <Menu.Item exact as={NavLink} to={urlPreservingQuery(baseUrl)}>
        Overview
      </Menu.Item>
      <Menu.Item as={NavLink} exact to={urlPreservingQuery(`${baseUrl}/entities`)}>
        Entities
      </Menu.Item>
      <Menu.Item as={NavLink} exact to={urlPreservingQuery(`${baseUrl}/simulation`)}>
        Simulation
      </Menu.Item>
      <Menu.Item as={NavLink} exact to={urlPreservingQuery(`${baseUrl}/analysis`)}>
        Analysis
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(WorldStateNavigation);
