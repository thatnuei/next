import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import tw from "twin.macro"
import ChatInput from "../chat/ChatInput"
import ChatMenuButton from "../chat/ChatMenuButton"
import { useChatContext } from "../chat/context"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
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
} & TagProps<"div">

function ChannelView({ channel, ...props }: Props) {
  const { identity } = useChatContext()
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
    <div css={tw`flex flex-col`} {...props}>
      <header css={tw`flex flex-row items-center p-3 bg-background-0`}>
        <ChatMenuButton css={tw`mr-3`} />

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
      </header>

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap`}>
        <main css={tw`flex-1 bg-background-1`}>
          <MessageList messages={filteredMessages} />
        </main>

        {/* {isLargeScreen && (
          <aside>
            <CharacterList characters={channel.users} css={tw`w-64 ml-gap`} />
          </aside>
        )} */}
      </div>

      <ChatInput identity={identity} />
    </div>
  )
}

export default observer(ChannelView)
