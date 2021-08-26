import type { NonEmptyArray } from "./types"

export function isNonEmptyArray<Value>(
  array: ArrayLike<Value> | null | undefined,
): array is NonEmptyArray<Value> {
  return array != null && array.length > 0
}
