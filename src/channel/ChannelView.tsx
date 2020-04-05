import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ChatInput from "../chat/ChatInput"
import { useChatStream } from "../chat/streamContext"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import { users } from "../ui/icons"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import ChannelUserList from "./ChannelUserList"
import { ChannelModel } from "./state"

type Props = {
  channel: ChannelModel
} & TagProps<"div">

function ChannelView({ channel, ...props }: Props) {
  const stream = useChatStream()
  const isLargeScreen = useMediaQuery(screenQueries.large)

  return (
    <div css={tw`flex flex-col`} {...props}>
      <header css={tw`flex flex-row items-center p-3 bg-background-0`}>
        <ChatMenuButton css={tw`mr-3`} />

        <h1 css={[headerText2, tw`flex-1`]}>{channel.title}</h1>
        <ChannelFilters
          selectedMode={channel.selectedMode}
          onModeChange={channel.setSelectedMode}
        />

        {!isLargeScreen && (
          <Button title="Show users" css={[fadedButton, tw`ml-3`]}>
            <Icon which={users} />
          </Button>
        )}
      </header>

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap`}>
        <main css={tw`flex-1 bg-background-1`}>
          <MessageList
            list={channel.messageList}
            filter={(it) => channel.shouldShowMessage(it.type)}
          />
        </main>

        {isLargeScreen && (
          <ChannelUserList channel={channel} css={tw`w-56 min-h-0 ml-gap`} />
        )}
      </div>

      <ChatInput
        inputModel={channel.chatInput}
        onSubmit={(text) =>
          stream.send({
            type: "send-channel-message",
            channelId: channel.id,
            text,
          })
        }
      />
    </div>
  )
}

export default observer(ChannelView)
