import React from 'react';
import { Statistic, Message } from 'semantic-ui-react';
import {
  RadialChart,
  VerticalBarSeries,
  VerticalBarSeriesPoint,
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  YAxis,
  XAxis,
} from 'react-vis';
import { IndicatorState, IndicatorType, Indicator, RadialIndicatorItem } from './Indicator';
import MapIndicatorView from './MapIndicatorView';

const IndicatorView = <T extends Indicator>({
  indicator,
  elementSize,
}: {
  indicator: IndicatorState<T>;
  elementSize: [number, number];
}) => {
  switch (indicator.type) {
    case IndicatorType.VALUE: {
      return (
        <Statistic>
          <Statistic.Value>{indicator.value}</Statistic.Value>
          <Statistic.Label>{indicator.name}</Statistic.Label>
        </Statistic>
      );
    }
    case IndicatorType.CUSTOM:
      return <>{indicator.value || ''}</>;
    case IndicatorType.RADIAL: {
      const values = indicator.value as RadialIndicatorItem[];
      const total = values.reduce((sum, current) => sum + current.value, 0);
      return (
        <RadialChart
          showLabels
          labelsRadiusMultiplier={1}
          data={values.map(value => ({ label: value.label, angle: (value.value / total) * 360 }))}
          height={elementSize[1]}
          width={elementSize[0]}
        />
      );
    }
    case IndicatorType.BAR: {
      const values = indicator.value as VerticalBarSeriesPoint[];
      return (
        <XYPlot
          xType="ordinal"
          width={elementSize[0]}
          height={elementSize[1]}
          xDistance={elementSize[0]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries data={values} />
        </XYPlot>
      );
    }
    case IndicatorType.MAP: {
      return <MapIndicatorView configuration={indicator.value} size={elementSize} />;
    }
    default:
      return (
        <Message error>
          <Message.Header>Unknown indicator type: {(indicator as any).type}</Message.Header>
          <p>Something was misconfigured to see this.</p>
        </Message>
      );
  }
};

export default IndicatorView;
