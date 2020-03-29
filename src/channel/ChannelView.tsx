import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import MessageList from "../message/MessageList"
import { MessageModel } from "../message/MessageModel"
import { MessageType } from "../message/types"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import { users } from "../ui/icons"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import { ChannelMode, ChannelModel } from "./ChannelModel"

type Props = {
  channel: ChannelModel
  chatInput: React.ReactNode
  menuButton: React.ReactNode
}

function ChannelView({ channel, chatInput, menuButton }: Props) {
  const [selectedMode, setSelectedMode] = useState<ChannelMode>("both")
  const isLargeScreen = useMediaQuery(screenQueries.large)

  const isType = (...types: MessageType[]) => (message: MessageModel) =>
    types.includes(message.type)

  const filteredMessages = (() => {
    if (selectedMode === "chat") {
      return channel.messageList.items.filter(
        isType("normal", "system", "admin"),
      )
    }
    if (selectedMode === "ads") {
      return channel.messageList.items.filter(isType("lfrp", "system", "admin"))
    }
    return channel.messageList.items
  })()

  return (
    <div css={tw`flex flex-col w-full h-full`}>
      <div css={tw`flex flex-row items-center p-3 bg-background-0`}>
        {menuButton}

        <h1 css={[headerText2, tw`flex-1`]}>{channel.title}</h1>
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

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap`}>
        <div css={tw`flex-1 bg-background-1`}>
          <MessageList messages={filteredMessages} />
        </div>

        {/* {isLargeScreen && (
          <CharacterList characters={channel.users} css={tw`w-64 ml-gap`} />
        )} */}
      </div>

      {chatInput}
    </div>
  )
}

export default observer(ChannelView)
