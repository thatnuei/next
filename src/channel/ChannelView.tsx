import React, { useState } from "react"
import CharacterList from "../character/CharacterList"
import { Character } from "../character/types"
import { gapSize } from "../chat/Chat"
import Button from "../dom/Button"
import MessageList from "../message/MessageList"
import { Message, MessageType } from "../message/types"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import { users } from "../ui/icons"
import {
  alignItems,
  block,
  flex1,
  flexColumn,
  flexRow,
  hidden,
  largeScreen,
  minH,
  ml,
  my,
  p,
  size,
  themeBgColor,
  w,
} from "../ui/style"
import ChannelFilters from "./ChannelFilters"
import { ChannelMode } from "./types"

type Props = {
  title: string
  messages: Message[]
  users: Character[]
  chatInput: React.ReactNode
  menuButton: React.ReactNode
}

function ChannelView(props: Props) {
  const [selectedMode, setSelectedMode] = useState<ChannelMode>("both")

  function getFilteredMessages() {
    const isType = (...types: MessageType[]) => (message: Message) =>
      types.includes(message.type)

    if (selectedMode === "chat") {
      return props.messages.filter(isType("normal", "system", "admin"))
    }
    if (selectedMode === "ads") {
      return props.messages.filter(isType("lfrp", "system", "admin"))
    }
    return props.messages
  }

  return (
    <div css={[size("full"), flexColumn]}>
      <div css={[themeBgColor(0), p(3), flexRow, alignItems("center")]}>
        {props.menuButton}

        <h1 css={[headerText2, flex1]}>{props.title}</h1>
        <ChannelFilters
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
        />

        <Button
          title="Show users"
          css={[fadedButton, ml(3), block, largeScreen(hidden)]}
        >
          <Icon which={users} />
        </Button>
      </div>

      <div css={[flex1, flexRow, my(gapSize), minH(0)]}>
        <div css={[flex1, themeBgColor(1)]}>
          <MessageList messages={getFilteredMessages()} />
        </div>
        <div css={[ml(gapSize), w(60), hidden, largeScreen(block)]}>
          <CharacterList characters={props.users} />
        </div>
      </div>

      {props.chatInput}
    </div>
  )
}

export default ChannelView
