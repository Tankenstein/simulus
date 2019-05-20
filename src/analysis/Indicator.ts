import { VerticalBarSeriesPoint } from 'react-vis';
import { EntityStateView } from '../entity';
import { RequireAtLeastOne } from 'type-fest';

// TODO: bunch more indicators
export type Indicator =
  | ValueIndicator
  | RadialIndicator
  | BarIndicator
  | CustomIndicator
  | MapIndicator;

/**
 * Used to render a pie chart
 */
export type RadialIndicator = BaseIndicator<IndicatorType.RADIAL, RadialIndicatorItem[]>;

export interface RadialIndicatorItem {
  value: number;
  label: string;
}

/**
 * Used to render a bar chart
 */
export type BarIndicator = BaseIndicator<IndicatorType.BAR, VerticalBarSeriesPoint[]>;

/**
 * Used to render a map with data on it
 */
export type MapIndicator = BaseIndicator<IndicatorType.MAP, MapIndicatorConfiguration>;

export interface MapIndicatorConfiguration {
  startingViewport?: {
    latitute?: number;
    longitude?: number;
    zoom?: number;
  };
  mapBoxToken?: string;
  markers?: MapIndicatorMarker[];
}

export interface MapIndicatorMarker {
  latitude: number;
  longitude: number;
  content: RequireAtLeastOne<MapIndicatorMarkerContent, 'custom' | 'icon'>;
  offsetTop?: number;
  offsetLeft?: number;
}

export interface MapIndicatorMarkerContent {
  icon?: {
    name: string;
    color?: string;
  };
  custom?: React.ReactNode;
}

/**
 * Used to render a simple value
 */
export type ValueIndicator = BaseIndicator<IndicatorType.VALUE, string | number>;

/**
 * Used to render a custom indicator with a react component you provide.
 */
export type CustomIndicator = BaseIndicator<IndicatorType.CUSTOM, React.ReactNode>;

interface BaseIndicator<TypeT extends IndicatorType, ValueT> {
  id: string;
  name: string;
  type: TypeT;
  calculate: (state: IndicatorWorldState) => ValueT;
}

export type IndicatorWorldState = {
  entities: EntityStateView[];
};

export type IndicatorState<T extends Indicator> = T & {
  value: ReturnType<T['calculate']>;
};

export enum IndicatorType {
  VALUE = 'value',
  RADIAL = 'radial',
  CUSTOM = 'custom',
  BAR = 'bar',
  MAP = 'map',
}
