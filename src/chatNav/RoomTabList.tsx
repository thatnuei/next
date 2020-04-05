import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { useChannels } from "../channel/state"
import { useChannelBrowserHelpers } from "../channelBrowser/state"
import Avatar from "../character/Avatar"
import { useChatState } from "../chat/chatStateContext"
import { useChatContext } from "../chat/context"
import { compare } from "../common/compare"
import { createPrivateChatHelpers } from "../privateChat/state"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab from "./RoomTab"
import { useChatNav } from "./state"

function RoomTabList() {
  const state = useChatState()
  const { identity } = useChatContext()
  const { setView, currentChannel, currentPrivateChat } = useChatNav()
  const { isPublic } = useChannelBrowserHelpers()
  const { leave } = useChannels()
  const { closeChat } = createPrivateChatHelpers(state, identity)

  const privateChatTabs = [...state.privateChats.values()]
    .filter((it) => it.isOpen)
    .sort(compare((it) => it.partnerName.toLowerCase()))
    .map((chat) => (
      <RoomTab
        key={chat.partnerName}
        title={chat.partnerName}
        icon={<Avatar name={chat.partnerName} css={tw`w-5 h-5`} />}
        isActive={chat === currentPrivateChat}
        isUnread={chat.isUnread}
        onClick={() =>
          setView({ type: "privateChat", partnerName: chat.partnerName })
        }
        onClose={() => closeChat(chat.partnerName)}
      />
    ))

  const channelTabs = [...state.channels.values()]
    .filter((it) => it.joinState !== "absent")
    .sort(compare((it) => it.title.toLowerCase()))
    .map((channel) => (
      <RoomTab
        key={channel.id}
        title={channel.title}
        icon={
          isPublic(channel.id) ? (
            <Icon which={icons.earth} css={tw`w-5 h-5`} />
          ) : (
            <Icon which={icons.lock} css={tw`w-5 h-5`} />
          )
        }
        isActive={channel === currentChannel}
        isUnread={channel.isUnread}
        onClick={() => setView({ type: "channel", id: channel.id })}
        onClose={() => leave(channel.id)}
      />
    ))

  return (
    <>
      {privateChatTabs}
      {channelTabs}
    </>
  )
}

export default observer(RoomTabList)
