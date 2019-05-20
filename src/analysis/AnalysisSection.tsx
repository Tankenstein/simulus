import React, { useState, createRef, useEffect } from 'react';
import { Button, Message, Header, Modal, Grid, GridColumn } from 'semantic-ui-react';
import { Responsive, Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { IndicatorState, Indicator } from './Indicator';
import IndicatorForm from './IndicatorForm';
import IndicatorView from './IndicatorView';
import { Dict, SizeProvider, copy } from '../utils';
import { EntityStateView } from '../entity';

const GridLayout = WidthProvider(Responsive);

const AnalysisSection = ({
  entityStates,
  indicators,
  availableIndicators,
  onCreateIndicator,
  onDeleteIndicator,
  onSaveLayout,
  layout,
}: {
  entityStates: EntityStateView[];
  availableIndicators: Dict<Indicator>;
  indicators: Dict<Indicator>;
  layout: Layout[];
  onCreateIndicator: (indicator: Indicator) => any;
  onDeleteIndicator: (indicator: Indicator) => any;
  onSaveLayout: (layout: Layout[]) => any;
}) => {
  const [indicatorStates, setIndicatorStates] = useState<Dict<IndicatorState<Indicator>>>({});
  const [addingIndicator, setAddingIndicator] = useState(false);
  const availableIndicatorValues = Object.values(availableIndicators);

  useEffect(() => {
    const newIndicatorStates = Object.values(indicators)
      .map(indicator => {
        const stateCopy = { entities: copy(entityStates) };
        return {
          ...indicator,
          value: indicator.calculate(stateCopy),
        };
      })
      .reduce((acc, current) => ({ ...acc, [current.id]: current }), {});
    setIndicatorStates(newIndicatorStates);
  }, [entityStates]);

  const indicatorValues = Object.values(indicatorStates);

  return (
    <>
      <Grid doubling>
        <GridColumn width="8">
          <Header as="h2">Analysis view</Header>
        </GridColumn>
        <GridColumn width="8" floated="right" textAlign="right">
          {availableIndicatorValues.length ? (
            <Button primary onClick={() => setAddingIndicator(true)}>
              Add an indicator
            </Button>
          ) : (
            ''
          )}
        </GridColumn>
      </Grid>

      <Modal open={addingIndicator} onClose={() => setAddingIndicator(false)} size="small">
        <Modal.Content>
          <IndicatorForm
            availableIndicators={availableIndicators}
            onSubmit={indicator => {
              onCreateIndicator(indicator);
              setAddingIndicator(false);
            }}
            onCancel={() => setAddingIndicator(false)}
          />
        </Modal.Content>
      </Modal>
      {indicatorValues.length ? (
        <GridLayout
          cols={{
            lg: 4,
            md: 3,
            sm: 3,
            xs: 1,
          }}
          style={{ marginTop: '16px' }}
          breakpoints={{ md: 700, sm: 480, xs: 240 }}
          containerPadding={[0, 0]}
          draggableCancel=".analysis-drag-cancel"
          onLayoutChange={layout => onSaveLayout(layout)}
          layouts={{ md: layout, sm: layout, xs: layout }}
        >
          {indicatorValues.map((indicator, index) => {
            const elementRef = createRef<HTMLDivElement>();
            return (
              <div
                key={`${index}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                ref={elementRef}
              >
                <SizeProvider observeRef={elementRef}>
                  {size => <IndicatorView indicator={indicator} elementSize={size} />}
                </SizeProvider>
                <Button
                  basic
                  size="mini"
                  circular
                  icon="close"
                  style={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => onDeleteIndicator(indicator)}
                />
              </div>
            );
          })}
        </GridLayout>
      ) : (
        <Message>
          <Message.Header>No indicators created yet</Message.Header>
          <Message.Content style={{ marginTop: '16px' }}>
            <Button primary onClick={() => setAddingIndicator(true)}>
              Add an indicator
            </Button>
          </Message.Content>
        </Message>
      )}
      {!availableIndicatorValues.length ? (
        <Message>
          <Message.Header>No indicators available</Message.Header>
          <Message.Content style={{ marginTop: '16px' }}>
            Please use a module that provides indicators if you want to use them
          </Message.Content>
        </Message>
      ) : (
        ''
      )}
    </>
  );
};

export default AnalysisSection;
