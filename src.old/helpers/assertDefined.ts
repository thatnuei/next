export function assertDefined<T>(value: T | undefined | null, error?: string): T {
  if (value == null) {
    throw new Error(error || `Assertion failed: expected non-null`)
  }
  return value
}
