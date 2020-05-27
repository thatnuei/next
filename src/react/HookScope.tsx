import React from "react"

type HookScopeProps = {
  children: () => React.ReactNode
}

export default function HookScope(props: HookScopeProps) {
  return <>{props.children()}</>
}
