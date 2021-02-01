/**
 * Creates a factory function from a class
 * @param cls
 */
export function factoryFrom<A extends unknown[], T>(
	cls: new (...args: A) => T,
) {
	return (...args: A) => new cls(...args)
}
