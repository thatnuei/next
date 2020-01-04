import { CompareFn } from "../types"
import error from "./error"

const invalidValuesError =
  "The function passed to compareBy should return the same type (of number or string) for both values"

function compareBy<T>(getValue: (item: T) => number | string): CompareFn<T> {
  return (a, b) => {
    const valueA = getValue(a)
    const valueB = getValue(b)

    if (typeof valueA === "number" && typeof valueB === "number") {
      return valueA - valueB
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB)
    }

    error(invalidValuesError)
  }
}

export default compareBy
