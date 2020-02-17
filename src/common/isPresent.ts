export const isPresent = <T>(value: T | undefined | null): value is T =>
  value != null
