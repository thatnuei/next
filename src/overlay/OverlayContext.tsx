import React, { ProviderProps, useContext } from "react"
import OverlayViewModel from "./OverlayViewModel"

const OverlayContext = React.createContext<OverlayViewModel>()

export function OverlayProvider(props: ProviderProps<OverlayViewModel>) {
  return <OverlayContext.Provider {...props} />
}

export function useOverlay() {
  const context = useContext(OverlayContext)
  if (!context) {
    throw new Error("useOverlay can only be used in overlay contexts")
  }
  return context
}
