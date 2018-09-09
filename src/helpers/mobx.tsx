import { Observer } from "mobx-react"
import React from "react"

export function observerCallback<A extends any[]>(renderFn: (...args: A) => React.ReactNode) {
  return (...args: A) => <Observer>{() => renderFn(...args)}</Observer>
}
