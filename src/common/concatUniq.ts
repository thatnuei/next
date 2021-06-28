import { unique } from "./unique"

export const concatUnique =
	<T>(value: T) =>
	(items: Iterable<T>) =>
		unique([...items, value])
