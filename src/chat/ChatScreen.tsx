import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import { cover } from "polished"
import React from "react"
import { CharacterMenuProvider } from "../character/CharacterMenuContext"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import { styled } from "../ui/styled"
import { ThemeColor } from "../ui/theme"
import ChatNavigation from "./ChatNavigation"

const ChatScreen = () => {
  const {
    chatStore: { identity },
    viewStore,
  } = useRootStore()

  return (
    <AppDocumentTitle title={identity}>
      <CharacterMenuProvider>
        <Box
          direction="row"
          gap="xsmall"
          style={cover()}
          background={ThemeColor.bgDivision}
        >
          <ChatNavigation />
          {viewStore.renderChatRoom()}
        </Box>
      </CharacterMenuProvider>
    </AppDocumentTitle>
  )
}
export default observer(ChatScreen)

const Container = styled.main`
  ${cover()};

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 100%;
`

const SidebarContainer = styled.nav`
  /* TODO */
`
