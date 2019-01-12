import { observer } from "mobx-react"
import { darken } from "polished"
import React from "react"
import { CharacterInfo } from "../character/CharacterInfo"
import { NavigationScreen } from "../navigation/NavigationStore"
import { appStore } from "../store"
import { flist4, flist5 } from "../ui/colors"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { ChatActions } from "./ChatActions"
import { ChatNavigation } from "./ChatNavigation"

type Props = {
  onTabActivate?: () => void
}

@observer
export class ChatSidebar extends React.Component<Props> {
  render() {
    return (
      <Container>
        <ChatActionsContainer>
          <ChatActions />
        </ChatActionsContainer>
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <CharacterInfoContainer>
            <CharacterInfo character={appStore.chatStore.identityCharacter} />
          </CharacterInfoContainer>
          <ChatNavigationContainer>
            <ChatNavigation onTabActivate={this.props.onTabActivate} />
          </ChatNavigationContainer>
        </div>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 16rem;
  display: flex;
  flex-shrink: 0;
  height: 100%;
`

const ChatActionsContainer = styled.div`
  grid-row: span 2;
  padding-top: 0.5rem;
`

const CharacterInfoContainer = styled.div`
  background-color: ${flist4};
  padding: 0.8rem;
`

const ChatNavigationContainer = styled.div`
  background-color: ${flist5};
  flex-grow: 1;
`

export const chatSidebarKey = "chatSidebar"

export const chatSidebarOverlay = (): NavigationScreen => ({
  key: chatSidebarKey,
  render: ({ close }) => (
    <Overlay anchor="left" onShadeClick={close}>
      <SidebarOverlayContainer>
        <ChatSidebar onTabActivate={close} />
      </SidebarOverlayContainer>
    </Overlay>
  ),
})

const SidebarOverlayContainer = styled.div`
  background-color: ${darken(0.05, flist5)};
  height: 100%;
`
