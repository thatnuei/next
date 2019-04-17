import { observer } from "mobx-react-lite"
import { cover } from "polished"
import React from "react"
import { CharacterMenuProvider } from "../character/CharacterMenuContext"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import { styled } from "../ui/styled"
import ChatSidebarContent from "./ChatSidebarContent"

const ChatScreen = () => {
  const {
    chatStore: { identity },
    viewStore,
  } = useRootStore()

  return (
    <AppDocumentTitle title={identity}>
      <CharacterMenuProvider>
        <Container>
          <SidebarContainer>
            <ChatSidebarContent />
          </SidebarContainer>
          {viewStore.renderChatRoom()}
        </Container>
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
