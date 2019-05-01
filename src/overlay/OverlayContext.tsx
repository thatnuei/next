import React, { ProviderProps, useContext, useEffect } from "react"
import {
  ENTERED,
  ENTERING,
  EXITED,
  EXITING,
  TransitionStatus,
} from "react-transition-group/Transition"
import { useRootStore } from "../RootStore"

export type OverlayContextType = {
  transitionStatus: TransitionStatus
  transitionTimeout: number
  key: string
}

export type OverlayHelpers = ReturnType<typeof useOverlay>

const OverlayContext = React.createContext<OverlayContextType>()

export function OverlayProvider(props: ProviderProps<OverlayContextType>) {
  return <OverlayContext.Provider {...props} />
}

let count = 0
export function useOverlay() {
  const context = useContext(OverlayContext)
  if (!context) {
    throw new Error("useOverlay can only be used in overlay contexts")
  }

  const { transitionStatus, transitionTimeout } = context
  const { overlayStore } = useRootStore()

  useEffect(() => {
    console.log(`render #${++count}`)
  })

  const isEntering =
    transitionStatus === ENTERING || transitionStatus === ENTERED

  const isExiting = transitionStatus === EXITING || transitionStatus === EXITED

  const close = () => overlayStore.close(context.key)

  return {
    isEntering,
    isExiting,
    transitionTimeout,
    transitionStatus,
    close,
  }
}
