import { observer } from "mobx-react-lite"
import React from "react"
import { Transition, TransitionGroup } from "react-transition-group"
import ChannelBrowser from "../channel/ChannelBrowser"
import CharacterMenu from "../character/components/CharacterMenu"
import Navigation from "../chat/components/Navigation"
import UpdateStatusForm from "../chat/UpdateStatus"
import ContextMenu from "../ui/components/ContextMenu"
import Drawer from "../ui/components/Drawer"
import Modal from "../ui/components/Modal"
import useRootStore from "../useRootStore"
import { Overlay } from "./OverlayStore"

function OverlayRenderer() {
  const { overlayStore } = useRootStore()

  type RenderOverlayProps = {
    visible: boolean
    onClose: () => void
  }

  function renderOverlay(overlay: Overlay, props: RenderOverlayProps) {
    switch (overlay.type) {
      case "channelBrowser":
        return (
          <Modal
            title="Channels"
            panelWidth={400}
            panelHeight={600}
            children={<ChannelBrowser />}
            {...props}
          />
        )

      case "primaryNavigation":
        return <Drawer side="left" children={<Navigation />} {...props} />

      case "updateStatus":
        return (
          <Modal
            title="Update Status"
            panelWidth={500}
            panelHeight={350}
            children={<UpdateStatusForm />}
            {...props}
          />
        )

      case "characterMenu":
        return (
          <ContextMenu position={overlay.params.position} {...props}>
            <CharacterMenu characterName={overlay.params.name} />
          </ContextMenu>
        )

      default:
        return null
    }
  }

  return (
    <TransitionGroup component={null}>
      {overlayStore.overlays.map((overlay) => (
        <Transition key={overlay.type} timeout={200}>
          {(state) =>
            renderOverlay(overlay, {
              visible: state === "entering" || state === "entered",
              onClose: () => overlayStore.close(overlay.type),
            })
          }
        </Transition>
      ))}
    </TransitionGroup>
  )
}

export default observer(OverlayRenderer)
