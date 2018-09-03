import { observer } from "mobx-react"
import React from "react"
import { CharacterInfo } from "../character/CharacterInfo"
import { SessionState } from "../session/SessionState"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"
import { ChatActions } from "./ChatActions"
import { ChatNavigation } from "./ChatNavigation"

type Props = {
  session: SessionState
}

@observer
export class ChatSidebar extends React.Component<Props> {
  render() {
    return (
      <Container>
        <ChatActionsContainer>
          <ChatActions />
        </ChatActionsContainer>
        <CharacterInfoContainer>
          <CharacterInfo character={this.props.session.identityCharacter} />
        </CharacterInfoContainer>
        <ChatNavigationContainer>
          <ChatNavigation session={this.props.session} />
        </ChatNavigationContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 18rem;

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: min-content 1fr;
  grid-row-gap: 4px;

  flex-shrink: 0;
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
  background-color: ${flist5};
`
