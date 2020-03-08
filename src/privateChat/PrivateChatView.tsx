import React from "react"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import { Character } from "../character/types"
import { gapSize } from "../chat/Chat"
import MessageList from "../message/MessageList"
import { Message } from "../message/types"
import {
  alignItems,
  flex1,
  flexColumn,
  flexRow,
  maxH,
  minH,
  ml,
  my,
  p,
  scrollVertical,
  size,
  themeBgColor,
} from "../ui/style"

type Props = {
  partner: Character
  messages: Message[]
  chatInput: React.ReactNode
  menuButton: React.ReactNode
}

function PrivateChatView({ partner, messages, menuButton, chatInput }: Props) {
  return (
    <div>
      <div>
        {menuButton}
        <Avatar name={partner.name} />
        <div>
          <CharacterName name={partner.name} gender={partner.gender} />
          <CharacterStatusText {...partner} />
        </div>
      </div>

      <div>
        <MessageList messages={messages} />
      </div>

      {chatInput}
    </div>
  )
}

export default PrivateChatView
