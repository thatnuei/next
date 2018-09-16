import { observer } from "mobx-react"
import React from "react"
import { appStore } from "../app/AppStore"
import { Avatar } from "../character/Avatar"
import { CharacterName } from "../character/CharacterName"
import { CharacterStatus } from "../character/CharacterStatus"
import { styled } from "../ui/styled"
import { PrivateChatModel } from "./PrivateChatModel"

export interface PrivateChatHeaderProps {
  privateChat: PrivateChatModel
}

@observer
export class PrivateChatHeader extends React.Component<PrivateChatHeaderProps> {
  render() {
    const { privateChat } = this.props
    const character = appStore.characterStore.getCharacter(privateChat.partner)

    return (
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
