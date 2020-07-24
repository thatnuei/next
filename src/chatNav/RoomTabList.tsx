import { useObservable } from "micro-observables"
import React from "react"
import { useRecoilValue } from "recoil"
import tw from "twin.macro"
import { ChannelModel } from "../channel/ChannelModel"
import { useJoinedChannels } from "../channel/helpers"
import { useIsPublicChannel } from "../channelBrowser/helpers"
import Avatar from "../character/Avatar"
import { compare } from "../helpers/common/compare"
import { useOpenPrivateChats } from "../privateChat/helpers"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { useRootStore } from "../root/context"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab from "./RoomTab"
import { chatNavViewAtom, useSetViewAction } from "./state"

function RoomTabList() {
  const joinedChannels = useJoinedChannels()
  const privateChats = useOpenPrivateChats()

  const privateChatTabs = privateChats
    .slice()
    .sort(compare((chat) => chat.partnerName.toLowerCase()))
    .map((chat) => <PrivateChatTab key={chat.partnerName} chat={chat} />)

  const channelTabs = joinedChannels.map((channel) => (
    <ChannelRoomTab key={channel.id} channel={channel} />
  ))

  return [privateChatTabs, channelTabs] as any
}

export default RoomTabList

function PrivateChatTab({ chat }: { chat: PrivateChatModel }) {
  const root = useRootStore()
  const isUnread = useObservable(chat.isUnread)

  const view = useRecoilValue(chatNavViewAtom)
  const isActive =
    view?.type === "privateChat" && view.partnerName === chat.partnerName
  const setView = useSetViewAction()

  return (
    <RoomTab
      title={chat.partnerName}
      icon={<Avatar name={chat.partnerName} css={tw`w-5 h-5`} />}
      isActive={isActive}
      isUnread={isUnread}
      onClick={() =>
        setView({ type: "privateChat", partnerName: chat.partnerName })
      }
      onClose={() => root.privateChatStore.close(chat.partnerName)}
    />
  )
}

function ChannelRoomTab({ channel }: { channel: ChannelModel }) {
  const root = useRootStore()

  const title = useObservable(channel.title)
  const isUnread = useObservable(channel.isUnread)
  const isPublic = useIsPublicChannel(channel.id)

  const view = useRecoilValue(chatNavViewAtom)
  const isActive = view?.type === "channel" && view.id === channel.id
  const setView = useSetViewAction()

  return (
    <RoomTab
      key={channel.id}
      title={title}
      icon={
        isPublic ? (
          <Icon which={icons.earth} css={tw`w-5 h-5`} />
        ) : (
          <Icon which={icons.lock} css={tw`w-5 h-5`} />
        )
      }
      isActive={isActive}
      isUnread={isUnread}
      onClick={() => setView({ type: "channel", id: channel.id })}
      onClose={() => root.channelStore.leave(channel.id)}
    />
  )
}
