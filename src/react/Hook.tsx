import React from "react"

type HookProps<T> = {
  using: () => T
  children: (value: T) => React.ReactNode
}

export default function Hook<T>(props: HookProps<T>) {
  const value = props.using()
  return <>{props.children(value)}</>
}
