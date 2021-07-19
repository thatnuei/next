import type { Dict } from "./types"

/**
 * helper function for creating dictionary update functions
 * @example
 * const updateCharacter = createUpdateDict(name => createCharacter(name))
 *
 * const [characterDict, setCharacterDict] = useState<Dict<Character>>({})
 *
 * setCharacterDict(
 *   updateCharacter(id, char => ({ ...char, name: newName }))
 * )
 */
export function createUpdateDict<T>(fallback: (key: string) => T) {
	return (key: string, update: (value: T) => T) =>
		(dict: Dict<T>): Dict<T> => ({
			...dict,
			[key]: update(dict[key] ?? fallback(key)),
		})
}
