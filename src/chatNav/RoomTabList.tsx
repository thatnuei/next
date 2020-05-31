import { observer, useObserver } from "mobx-react-lite"
import React from "react"
import { useRecoilValue } from "recoil"
import tw from "twin.macro"
import {
  channelAtom,
  useJoinedChannelIds,
  useLeaveChannelAction,
} from "../channel/state"
import { isPublicSelector } from "../channelBrowser/state"
import Avatar from "../character/Avatar"
import { useChatState } from "../chat/chatStateContext"
import { useChatStream } from "../chat/streamContext"
import { compare } from "../helpers/common/compare"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab from "./RoomTab"
import { useChatNav, useSetViewAction } from "./state"

function RoomTabList() {
  const state = useChatState()
  const stream = useChatStream()
  const { currentPrivateChat } = useChatNav()
  const setView = useSetViewAction()
  const joinedChannelIds = useJoinedChannelIds()

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
  const channelTabs = joinedChannelIds.map((id) => (
    <ChannelRoomTab key={id} id={id} />
  ))

  return [privateChatTabs, channelTabs] as any
}

export default observer(RoomTabList)

function ChannelRoomTab({ id }: { id: string }) {
  const channel = useRecoilValue(channelAtom(id))
  const isPublic = useRecoilValue(isPublicSelector(id))
  const setView = useSetViewAction()
  const leaveChannel = useLeaveChannelAction()

  const state = useChatState()
  const isActive = useObserver(
    () => state.nav.view?.type === "channel" && state.nav.view.id === id,
  )

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
      isActive={isActive}
      isUnread={channel.isUnread}
      onClick={() => setView({ type: "channel", id })}
      onClose={() => leaveChannel(id)}
    />
  )
}
