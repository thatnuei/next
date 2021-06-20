import * as React from "react"
import { useContext } from "react"
import { raise } from "../common/raise"

const missingValue = Symbol()

/**
 * Convenience wrapper for react context
 * @param hook Hook to run, returns the value passed through context
 * @param resolveMissing Use this to return a default value if the provider is missing, or throw an error
 */
function createContextWrapper<R, I extends Record<string, unknown>>(
	hook: (init: I) => R,
	resolveMissing: () => R = () => raise("Missing context provider"),
) {
	const Context = React.createContext<R | typeof missingValue>(missingValue)

	function Provider(props: I & { children: React.ReactNode }) {
		const context = hook(props)
		return <Context.Provider value={context}>{props.children}</Context.Provider>
	}

	function useWrappedContext() {
		const context = useContext(Context)
		return context === missingValue ? resolveMissing() : context
	}

	useWrappedContext.Provider = Provider
	useWrappedContext.Context = Context

	return useWrappedContext
}

export default createContextWrapper
