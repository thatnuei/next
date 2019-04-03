import { observer } from "mobx-react-lite"
import { cover } from "polished"
import React from "react"
import ChannelRoomView from "../channel/ChannelRoomView"
import { CharacterMenuProvider } from "../character/CharacterMenuContext"
import PrivateChatRoomView from "../private-chat/PrivateChatRoomView"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import { styled } from "../ui/styled"
import ChatSidebarContent from "./ChatSidebarContent"

const ChatScreen = () => {
  const {
    chatStore: { identity },
    viewStore: { screen },
    channelStore: { channels },
  } = useRootStore()

  const renderRoom = () => {
    switch (screen.name) {
      case "channel":
        return <ChannelRoomView channel={channels.get(screen.channel)} />
      case "privateChat":
        return <PrivateChatRoomView partnerName={screen.partnerName} />
      default:
        return <p>view not found</p>
    }
  }

  return (
    <AppDocumentTitle title={identity}>
      <CharacterMenuProvider>
        <Container>
          <SidebarContainer>
            <ChatSidebarContent />
          </SidebarContainer>

          {renderRoom()}
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
