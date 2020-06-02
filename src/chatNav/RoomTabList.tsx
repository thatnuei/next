import { flow, map, sortBy, toLower } from "lodash/fp"
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
import {
  openPrivateChatPartnersAtom,
  privateChatAtom,
  useClosePrivateChatAction,
} from "../privateChat/state"
import HookScope from "../react/HookScope"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab from "./RoomTab"
import { chatNavViewAtom, useSetViewAction } from "./state"

function RoomTabList() {
  const setView = useSetViewAction()
  const joinedChannelIds = useJoinedChannelIds()
  const privateChats = useRecoilValue(openPrivateChatPartnersAtom)

  const privateChatTabs = flow(
    sortBy(toLower),
    map((partnerName) => (
      <HookScope key={partnerName}>
        {function useScope() {
          const chat = useRecoilValue(privateChatAtom(partnerName))
          const closeChat = useClosePrivateChatAction()
          const view = useRecoilValue(chatNavViewAtom)

          const isActive =
            view?.type === "privateChat" && view.partnerName === partnerName

          return (
            <RoomTab
              title={chat.partnerName}
              icon={<Avatar name={chat.partnerName} css={tw`w-5 h-5`} />}
              isActive={isActive}
              isUnread={chat.isUnread}
              onClick={() =>
                setView({ type: "privateChat", partnerName: chat.partnerName })
              }
              onClose={() => closeChat(partnerName)}
            />
          )
        }}
      </HookScope>
    )),
  )(privateChats)

  const channelTabs = joinedChannelIds.map((id) => (
    <ChannelRoomTab key={id} id={id} />
  ))

  return [privateChatTabs, channelTabs] as any
}

export default RoomTabList

function ChannelRoomTab({ id }: { id: string }) {
  const channel = useRecoilValue(channelAtom(id))
  const isPublic = useRecoilValue(isPublicSelector(id))
  const view = useRecoilValue(chatNavViewAtom)
  const isActive = view?.type === "channel" && view.id === id
  const setView = useSetViewAction()
  const leaveChannel = useLeaveChannelAction()

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
