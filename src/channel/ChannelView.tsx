import React from "react"
import CharacterList from "../character/CharacterList"
import { Character } from "../character/types"
import { gapSize } from "../chat/Chat"
import Button from "../dom/Button"
import MessageList from "../message/MessageList"
import { Message } from "../message/types"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import {
  alignItems,
  block,
  flex1,
  flexColumn,
  flexRow,
  hidden,
  leadingNone,
  minH,
  ml,
  my,
  p,
  screen,
  size,
  themeBgColor,
  w,
} from "../ui/style"

type Props = {
  title: string
  messages: Message[]
  users: Character[]
  chatInput: React.ReactNode
  menuButton: React.ReactNode
}

function ChannelView(props: Props) {
  return (
    <div css={[size("full"), flexColumn]}>
      <div css={[themeBgColor(0), p(3), flexRow, alignItems("center")]}>
        {props.menuButton}
        <h1 css={[headerText2, leadingNone]}>{props.title}</h1>
        <div css={flex1} />
        <Button
          title="Show users"
          css={[fadedButton, ml(3), block, screen.large(hidden)]}
        >
          <Icon name="users" />
        </Button>
      </div>

      <div css={[flex1, flexRow, my(gapSize), minH(0)]}>
        <div css={[flex1, themeBgColor(1)]}>
          <MessageList messages={props.messages} />
        </div>
        <div css={[ml(gapSize), w(60), hidden, screen.large(block)]}>
          <CharacterList characters={props.users} />
        </div>
      </div>

      {props.chatInput}
    </div>
  )
}

export default ChannelView
