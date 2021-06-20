import * as React from "react"

interface ScopeProps {
	children: () => React.ReactNode
}

export default function Scope(props: ScopeProps) {
	return <>{props.children()}</>
}
