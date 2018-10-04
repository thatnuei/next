export function trace<T>(value: T): T {
  // tslint:disable-next-line:no-console
  console.log(value)
  return value
}
