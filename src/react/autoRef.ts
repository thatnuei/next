import type { LegacyRef, ReactElement } from "react"
import { forwardRef } from "react"

interface FunctionComponent<Props> {
	(props: Props): ReactElement | null
	displayName?: string
}

/**
 * like forwardRef,
 * but it passes the ref as a prop instead of a separate argument
 */
export function autoRef<Props extends { ref?: LegacyRef<RefType> }, RefType>(
	component: FunctionComponent<Props>,
) {
	const AutoRef = forwardRef<RefType, Props>(function AutoRef(props, ref) {
		return component({ ...props, ref })
	})

	AutoRef.displayName = `AutoRef(${component.displayName || component.name})`

	return AutoRef
}
