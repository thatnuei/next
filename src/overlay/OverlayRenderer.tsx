import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo, useState } from "react"
import { Transition, TransitionGroup } from "react-transition-group"
import { TransitionStatus } from "react-transition-group/Transition"
import { useRootStore } from "../RootStore"
import { OverlayContextType, OverlayProvider } from "./OverlayContext"
import { OverlayInfo } from "./OverlayStore"

const transitionTimeout = 300

function OverlayRenderer() {
  const { overlayStore } = useRootStore()

  return (
    <TransitionGroup component={null} appear>
      {overlayStore.overlays.map((info) => (
        <Transition key={info.key} timeout={transitionTimeout}>
          {(transitionStatus) => (
            <OverlayRendererEntry
              info={info}
              transitionStatus={transitionStatus}
            />
          )}
        </Transition>
      ))}
    </TransitionGroup>
  )
}

export default observer(OverlayRenderer)

function OverlayRendererEntry({
  info,
  transitionStatus,
}: {
  info: OverlayInfo
  transitionStatus: TransitionStatus
}) {
  // in order for css transitions to work properly, the "exiting" state
  // has to play for one frame, to start in the initial state,
  // then wait for a browser paint or layout before playing the "entering" state
  //
  // unfortunately, the <Transition/> component does not wait a frame.
  // it plays "exiting" then "entering" _immediately_ before a repaint happens,
  // so elements using css transitions will appear to start in the "entering" state
  // and no transitioning will occur
  //
  // to work around this, we keep our own "delayed" transition status,
  // which watches the original transitionStatus and updates this one after a brower repaint
  // using rAF
  // that way, the overlay will receive "exiting" on one frame to start,
  // then it will receive "entering" after the browser has done a paint
  const [delayedStatus, setDelayedStatus] = useState(transitionStatus)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setDelayedStatus(transitionStatus)
    })
    return () => cancelAnimationFrame(id)
  }, [transitionStatus])

  const contextValue: OverlayContextType = useMemo(
    () => ({
      key: info.key,
      transitionStatus: delayedStatus,
      transitionTimeout,
    }),
    [delayedStatus, info.key],
  )

  return <OverlayProvider value={contextValue}>{info.content}</OverlayProvider>
}
