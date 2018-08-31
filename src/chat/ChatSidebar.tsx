import React from "react"
import { CharacterInfo } from "../character/CharacterInfo"
import { CharacterModel } from "../character/CharacterModel"
import { SessionState } from "../session/SessionState"
import { flist4 } from "../ui/colors"
import { styled } from "../ui/styled"
import { ChatActions } from "./ChatActions"
import { ChatNavigation } from "./ChatNavigation"

type Props = {
  session: SessionState
}

export class ChatSidebar extends React.Component<Props> {
  render() {
    const character = new CharacterModel(
      this.props.session.chat.identity,
      "Female",
      "dnd",
      "aaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    )

    return (
      <Container>
        <ChatActionsContainer>
          <ChatActions />
        </ChatActionsContainer>
        <CharacterInfoContainer>
          <CharacterInfo character={character} />
        </CharacterInfoContainer>
        <ChatNavigationContainer>
          <ChatNavigation />
        </ChatNavigationContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 16rem;
  margin-right: 4px;

  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: min-content 1fr;
  grid-row-gap: 4px;
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
  overflow-y: auto;
`
