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
    <div css={[size("full"), flexColumn]}>
      <div css={[themeBgColor(0), p(3), flexRow, alignItems("center")]}>
        {menuButton}
        <Avatar name={partner.name} css={size(14)} />
        <div css={[flexColumn, ml(5), maxH(18), scrollVertical]}>
          <CharacterName name={partner.name} gender={partner.gender} />
          <CharacterStatusText {...partner} />
        </div>
      </div>

      <div css={[flex1, flexRow, my(gapSize), minH(0), themeBgColor(1)]}>
        <MessageList messages={messages} />
      </div>

      {chatInput}
    </div>
  )
}

export default PrivateChatView
