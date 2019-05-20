import React from 'react';
import { Header, Grid, GridColumn } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const IntroductionPage = () => (
  <Grid centered style={{ marginTop: '16px' }}>
    <GridColumn width={8}>
      <Header as="h1">Simulus is a prototype crisis simulation framework for web browsers</Header>
      <p>
        Simulus was developed during a master's thesis, and it is heavily inspired by the{' '}
        <a href="http://www.crismaproject.eu/">CRISMA project</a>. To view the source and
        documentation, head over to the{' '}
        <a href="https://github.com/tankenstein/simulus">source code repository</a>. To start using
        this simulus instance, head over to the <Link to="/scenarios">scenario list</Link>.
      </p>
    </GridColumn>
  </Grid>
);

export default IntroductionPage;
