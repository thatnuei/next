import { observer } from "mobx-react"
import React from "react"
import { CharacterInfo } from "../character/CharacterInfo"
import { sessionStore } from "../session/SessionStore"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"
import { ChatActions } from "./ChatActions"
import { ChatNavigation } from "./ChatNavigation"

@observer
export class ChatSidebar extends React.Component {
  render() {
    return (
      <Container>
        <ChatActionsContainer>
          <ChatActions />
        </ChatActionsContainer>
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <CharacterInfoContainer>
            <CharacterInfo character={sessionStore.identityCharacter} />
          </CharacterInfoContainer>
          <ChatNavigationContainer>
            <ChatNavigation />
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
