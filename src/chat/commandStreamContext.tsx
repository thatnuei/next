import React, { useContext, useMemo } from "react"
import { ChildrenProps } from "../jsx/types"
import { Stream } from "../state/stream"
import { ServerCommand } from "./commandHelpers"

const CommandStreamContext = React.createContext(new Stream<ServerCommand>())

export function CommandStreamProvider({ children }: ChildrenProps) {
  const stream = useMemo(() => new Stream<ServerCommand>(), [])
  return (
    <CommandStreamContext.Provider value={stream}>
      {children}
    </CommandStreamContext.Provider>
  )
}

export function useCommandStream() {
  return useContext(CommandStreamContext)
}
