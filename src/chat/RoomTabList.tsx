import { sortBy } from "lodash-es"
import { useChannelActions, useJoinedChannels } from "../channel/state"
import type { Channel } from "../channel/types"
import Avatar from "../character/Avatar"
import { useNickname } from "../character/nicknames"
import type { PrivateChat } from "../privateChat/types"
import { routes, useRoute } from "../router"
import type { Store } from "../state/store"
import { useStoreValue } from "../state/store"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useChatContext } from "./ChatContext"
import RoomTab from "./RoomTab"

export default function RoomTabList() {
  const joinedChannels = useJoinedChannels()
  const context = useChatContext()
  const openChatNames = useStoreValue(context.privateChatStore.openChatNames)

  return (
    <>
      {sortBy(Object.keys(openChatNames)).map((name) => (
        <PrivateChatTab
          key={name}
          privateChat={context.privateChatStore.privateChats.selectItem(name)}
          onClose={() => context.privateChatStore.closeChat(name)}
        />
      ))}
      {sortBy(joinedChannels, (ch) => ch.title.toLowerCase()).map((channel) => (
        <ChannelRoomTab key={channel.id} channel={channel} />
      ))}
    </>
  )
}

function PrivateChatTab({
  privateChat,
  onClose,
}: {
  privateChat: Store<PrivateChat>
  onClose: () => void
}) {
  const partnerName = useStoreValue(privateChat.select((pc) => pc.partnerName))
  const isUnread = useStoreValue(privateChat.select((pc) => pc.isUnread))
  const route = useRoute()
  const nickname = useNickname(partnerName)

  return (
    <RoomTab
      title={nickname || partnerName}
      icon={<Avatar name={partnerName} size={6} />}
      isActive={
        route.name === "privateChat" && route.params.partnerName === partnerName
      }
      isUnread={isUnread}
      onClick={() => routes.privateChat({ partnerName }).push()}
      onClose={onClose}
    />
  )
}

function ChannelRoomTab({ channel }: { channel: Channel }) {
  const context = useChatContext()
  const route = useRoute()
  const isPublic = useStoreValue(
    context.channelBrowserStore.selectIsPublic(channel.id),
  )
  const { leave } = useChannelActions(channel.id)

  return (
    <RoomTab
      key={channel.id}
      title={channel.title}
      icon={
        isPublic ? <Icon which={icons.earth} /> : <Icon which={icons.lock} />
      }
      isActive={
        route.name === "channel" && route.params.channelId === channel.id
      }
      isUnread={channel.isUnread}
      onClick={() => routes.channel({ channelId: channel.id }).push()}
      onClose={() => leave()}
    />
  )
}
