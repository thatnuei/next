import { observer } from "mobx-react-lite"
import React from "react"
import { useRecoilValue } from "recoil"
import tw from "twin.macro"
import { ChannelState } from "../channel/ChannelState"
import { isPublicSelector } from "../channelBrowser/state"
import Avatar from "../character/Avatar"
import { useChatState } from "../chat/chatStateContext"
import { useChatStream } from "../chat/streamContext"
import { compare } from "../helpers/common/compare"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab, { RoomTabProps } from "./RoomTab"
import { useChatNav } from "./state"

function RoomTabList() {
  const state = useChatState()
  const stream = useChatStream()
  const { setView, currentChannel, currentPrivateChat } = useChatNav()

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
        onClose={() =>
          stream.send({ type: "close-private-chat", name: chat.partnerName })
        }
      />
    ))

  // TODO: get from list of channel IDs
  const channelTabs = [...state.channels.values()]
    .filter((it) => it.joinState !== "absent")
    .sort(compare((it) => it.title.toLowerCase()))
    .map((channel) => (
      <ChannelRoomTab
        key={channel.id}
        channel={channel}
        isActive={channel === currentChannel}
        onClick={() => setView({ type: "channel", id: channel.id })}
        onClose={() => stream.send({ type: "leave-channel", id: channel.id })}
      />
    ))

  return [privateChatTabs, channelTabs] as any
}

export default observer(RoomTabList)

function ChannelRoomTab({
  channel,
  ...props
}: { channel: ChannelState } & Omit<
  RoomTabProps,
  "title" | "isUnread" | "icon"
>) {
  const isPublic = useRecoilValue(isPublicSelector(channel.id))

  return (
    <RoomTab
      key={channel.id}
      title={channel.title}
      icon={
        isPublic ? (
          <Icon which={icons.earth} css={tw`w-5 h-5`} />
        ) : (
          <Icon which={icons.lock} css={tw`w-5 h-5`} />
        )
      }
      isUnread={channel.isUnread}
      {...props}
    />
  )
}
