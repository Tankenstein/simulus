import { Layout } from 'react-grid-layout';
import { IndicatorType, Indicator } from './Indicator';

export function defaultLayout(results: Indicator[]): Layout[] {
  const layout: Layout[] = [];
  let currentX = 0;
  let currentY = 0;
  results.forEach((result, index) => {
    const [w, h] = getDefaultLayoutSizeOfIndicator(result);
    layout.push({
      i: `${index}`,
      x: currentX,
      y: currentY,
      w,
      h,
    });
    currentX += 1;
    if (currentX >= 2) {
      currentX = 0;
      currentY += 1;
    }
  });
  return layout;
}

function getDefaultLayoutSizeOfIndicator(result: Indicator): [number, number] {
  switch (result.type) {
    case IndicatorType.BAR:
    case IndicatorType.MAP:
      return [3, 2];
    case IndicatorType.CUSTOM:
    case IndicatorType.RADIAL:
      return [2, 2];
    default:
      return [1, 1];
  }
}
