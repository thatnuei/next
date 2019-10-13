import { observer } from "mobx-react-lite"
import React from "react"
import { Transition, TransitionGroup } from "react-transition-group"
import useRootStore from "../useRootStore"

function OverlayRenderer() {
  const { overlayStore } = useRootStore()

  return (
    <TransitionGroup component={null}>
      {overlayStore.overlays.map((overlay) => (
        <Transition key={overlay.key} timeout={200}>
          {(state) =>
            overlay.render({
              visible: state === "entering" || state === "entered",
              onClose: () => overlayStore.close(overlay.key),
            })
          }
        </Transition>
      ))}
    </TransitionGroup>
  )
}

export default observer(OverlayRenderer)
