import { createContext, useContext, useMemo } from "react"
import useMemoValue from "use-memo-value"

const noValue = Symbol()

/**
 * Accepts a function to create a context value,
 * then returns a provider component and a hook to consume it in a tuple
 */
export function createSimpleContext<
	Value,
	Args extends Record<string, unknown>,
>(name: string, createContextValue: (args: Args) => Value) {
	const Context = createContext<Value | typeof noValue>(noValue)

	function Provider({
		children,
		...args
	}: { children: React.ReactNode } & Args) {
		const memoArgs = useMemoValue(args)

		const value = useMemo(
			() => createContextValue(memoArgs as unknown as Args),
			[memoArgs],
		)

		return <Context.Provider value={value}>{children}</Context.Provider>
	}

	Provider.displayName = `Provider(${name})`

	function useContextValue() {
		const value = useContext(Context)
		if (value === noValue) {
			throw new Error(`Provider for context '${name}' not found`)
		}
		return value
	}

	return [Provider, useContextValue] as const
}
