import Dict from './Dict';

/**
 * Create a mapping of key -> item[] from an array of items that have the key calculated via a function you pass
 * @param items Items to create a mapping from
 * @param keyFn Function that gets run over every item, returning the grouping key
 */
export default function groupBy<T, K extends string>(
  items: T[] = [],
  keyFn: (item: T) => K,
): Dict<T[]> {
  return items.reduce<Dict<T[]>>((map, currentItem) => {
    const key = keyFn(currentItem);
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(currentItem);
    return map;
  }, {});
}
