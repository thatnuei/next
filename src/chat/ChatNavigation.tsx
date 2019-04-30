import { observer } from "mobx-react-lite"
import React from "react"
import CharacterInfo from "../character/CharacterInfo"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import ModalOverlay from "../ui/ModalOverlay"
import ModalPanel from "../ui/ModalPanel"
import ModalPanelHeader from "../ui/ModalPanelHeader"
import { gapSizes } from "../ui/theme"
import useToggleState from "../ui/useToggleState"
import NavigationActions from "./NavigationActions"
import NavigationTabs from "./NavigationTabs"
import StatusForm from "./StatusForm"

function ChatNavigation() {
  const { chatStore } = useRootStore()
  const statusOverlay = useToggleState()

  return (
    <>
      <Box as="nav" direction="row" style={{ height: "100%" }}>
        <NavigationActions onUpdateStatus={statusOverlay.enable} />

        <Box width={200} background="theme1" overflowY="auto">
          <Box background="theme0" pad={gapSizes.small}>
            <CharacterInfo name={chatStore.identity} />
          </Box>

          <NavigationTabs />
        </Box>
      </Box>

      <ModalOverlay
        isVisible={statusOverlay.on}
        onClose={statusOverlay.disable}
      >
        <ModalPanel>
          <ModalPanelHeader>Update Status</ModalPanelHeader>
          <StatusForm
            onSubmit={statusOverlay.disable}
            onCancel={statusOverlay.disable}
          />
        </ModalPanel>
      </ModalOverlay>
    </>
  )
}
export default observer(ChatNavigation)
