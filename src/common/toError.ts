export function toError(maybeError: unknown): Error {
	return maybeError instanceof Error
		? maybeError
		: new Error(String(maybeError))
}
