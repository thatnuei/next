import { observer } from "mobx-react-lite"
import React from "react"
import CharacterInfo from "../character/CharacterInfo"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import { gapSizes } from "../ui/theme"
import NavigationActions from "./NavigationActions"
import NavigationTabs from "./NavigationTabs"

function ChatNavigation() {
  const { chatStore } = useRootStore()

  return (
    <Box as="nav" direction="row" style={{ height: "100%" }}>
      <NavigationActions />

      <Box width={200} background="theme1" overflowY="auto">
        <Box background="theme0" pad={gapSizes.small}>
          <CharacterInfo name={chatStore.identity} />
        </Box>

        <NavigationTabs />
      </Box>
    </Box>
  )
}
export default observer(ChatNavigation)
