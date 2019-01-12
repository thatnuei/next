export function trace<T>(value: T): T {
  console.log(value)
  return value
}
