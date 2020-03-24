import React, { useState } from "react"
import tw from "twin.macro"
import CharacterList from "../character/CharacterList"
import { Character } from "../character/types"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import MessageList from "../message/MessageList"
import { Message, MessageType } from "../message/types"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import { users } from "../ui/icons"
import { screenQueries } from "../ui/screens"
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
  const isLargeScreen = useMediaQuery(screenQueries.large)

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
    <div css={tw`w-full h-full flex flex-col`}>
      <div css={tw`bg-background-0 p-3 flex flex-row items-center`}>
        {props.menuButton}

        <h1 css={[headerText2, tw`flex-1`]}>{props.title}</h1>
        <ChannelFilters
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
        />

        {!isLargeScreen && (
          <Button title="Show users" css={[fadedButton, tw`ml-3`]}>
            <Icon which={users} />
          </Button>
        )}
      </div>

      <div css={tw`flex-1 flex flex-row my-gap min-h-0`}>
        <div css={tw`flex-1 bg-background-1`}>
          <MessageList messages={getFilteredMessages()} />
        </div>

        {isLargeScreen && (
          <CharacterList characters={props.users} css={tw`ml-gap w-64`} />
        )}
      </div>

      {props.chatInput}
    </div>
  )
}

export default ChannelView
