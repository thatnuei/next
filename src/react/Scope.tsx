import * as React from "react"

type ScopeProps = {
  children: () => React.ReactNode
}

export default function Scope(props: ScopeProps) {
  return <>{props.children()}</>
}
