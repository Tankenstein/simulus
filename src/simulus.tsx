import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { Options } from './options';
import RootComponent from './RootComponent';

/**
 * Run simulus with the provided options.
 * @param element Element to mount the simulus application into
 * @param options Simulus options to use
 */
export default function simulus(element: HTMLElement, options: Options): void {
  render(<RootComponent options={options} />, element);
}
