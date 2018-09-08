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
        <div style={{ gridRow: "span 2", margin: "auto", marginRight: "0.5rem" }}>
          <Avatar name={privateChat.partner} size={60} />
        </div>
        <div style={{ overflowY: "auto" }}>
          <h2 style={{ marginBottom: "0.2rem" }}>
            <CharacterName name={privateChat.partner} />
          </h2>
          <div style={{ fontSize: "80%", fontStyle: "italic" }}>
            <CharacterStatus status={character.status} statusMessage={character.statusMessage} />
          </div>
        </div>
      </HeaderContainer>
    )

    return <ConversationLayout headerContent={headerContent} messages={privateChat.messages} />
  }
}

const HeaderContainer = styled.div`
  padding: 0.5rem;
  display: flex;

  max-height: 6rem;
`
