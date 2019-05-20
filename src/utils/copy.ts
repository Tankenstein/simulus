export default function copy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
