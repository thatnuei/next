import { observer } from "mobx-react"
import React from "react"
import { Avatar } from "../character/Avatar"
import { CharacterName } from "../character/CharacterName"
import { CharacterStatus } from "../character/CharacterStatus"
import { characterStore } from "../character/CharacterStore"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { styled } from "../ui/styled"
import { PrivateChatModel } from "./PrivateChatModel"

export interface PrivateConversationProps {
  privateChat: PrivateChatModel
}

@observer
export class PrivateConversation extends React.Component<PrivateConversationProps> {
  render() {
    const { privateChat } = this.props
    const character = characterStore.getCharacter(privateChat.partner)

    const headerContent = (
      <HeaderContainer>
        <AvatarContainer>
          <Avatar name={privateChat.partner} size={60} />
        </AvatarContainer>
        <InfoContainer>
          <NameContainer>
            <CharacterName name={privateChat.partner} />
          </NameContainer>
          <StatusContainer>
            <CharacterStatus status={character.status} statusMessage={character.statusMessage} />
          </StatusContainer>
        </InfoContainer>
      </HeaderContainer>
    )

    return <ConversationLayout headerContent={headerContent} messages={privateChat.messages} />
  }
}

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0.5rem;
  align-content: start;
`

const AvatarContainer = styled.div`
  grid-row: span 2;
  align-self: center;
  padding: 0.5rem;
`

const InfoContainer = styled.div`
  align-self: center;
`

const NameContainer = styled.h2`
  padding-bottom: 0.2rem;
  padding-top: 0.5rem;
`

const StatusContainer = styled.div`
  font-size: 80%;
  font-style: italic;
  max-height: 3rem;
  overflow-y: auto;
  padding-bottom: 0.5rem;
`
