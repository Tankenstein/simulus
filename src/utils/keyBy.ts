import Dict from './Dict';

type KeysToPropertiesOfType<T, P> = { [K in keyof T]: T[K] extends P ? K : never }[keyof T];

/**
 * Create a mapping of key -> item from an array of items that have that key
 * @param items Items to create a mapping from
 * @param key Key to map by
 */
export default function keyBy<T, K extends KeysToPropertiesOfType<T, string>>(
  items: T[] = [],
  key: K,
): Dict<T> {
  return items.reduce(
    (map, currentItem) => ({ ...map, [(currentItem[key] as any) as string]: currentItem }),
    {},
  );
}
