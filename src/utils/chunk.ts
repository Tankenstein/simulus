/**
 * Chunk list into chunks of size len
 * @param list
 * @param len
 */
export default function chunk<T>(list: T[], len: number): T[][] {
  const chunks = [];
  let i = 0;
  let n = list.length;

  while (i < n) {
    chunks.push(list.slice(i, (i += len)));
  }

  return chunks;
}
