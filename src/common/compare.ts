import { raise } from "./raise"

// prettier-ignore
type Compare = <T>(getValue: (item: T) => string | number) =>
  (a: T, b: T) => number

export const compare: Compare = (getValue) => (a, b) => {
	const valueA = getValue(a)
	const valueB = getValue(b)
	if (typeof valueA === "number" && typeof valueB === "number") {
		return Math.sign(valueA - valueB)
	}
	if (typeof valueA === "string" && typeof valueB === "string") {
		return valueA.localeCompare(valueB)
	}
	raise("expected value to always be number, or always be string")
}

export const compareReverse: Compare = (getValue) => (a, b) => {
	return compare(getValue)(a, b) * -1
}
