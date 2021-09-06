import { sortBy } from "lodash-es"
import { useChannelKeys } from "../channel/useChannelKeys"
import Avatar from "../character/Avatar"
import { useNickname } from "../character/nicknames"
import { pick } from "../common/pick"
import type { PrivateChat } from "../privateChat/types"
import { routes, useRoute } from "../router"
import type { Store } from "../state/store"
import { useStoreValue } from "../state/store"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useChatContext } from "./ChatContext"
import RoomTab from "./RoomTab"

export default function RoomTabList() {
  const context = useChatContext()
  const joinedChannels = useStoreValue(
    context.channelStore
      .selectJoinedChannels()
      .select((channels) => channels.map((ch) => pick(ch, ["id", "title"]))),
  )
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
        <ChannelRoomTab key={channel.id} channelId={channel.id} />
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

function ChannelRoomTab({ channelId }: { channelId: string }) {
  const context = useChatContext()
  const route = useRoute()
  const channel = useChannelKeys(channelId, ["title", "isUnread"])
  const isPublic = useStoreValue(
    context.channelBrowserStore.selectIsPublic(channelId),
  )

  return (
    <RoomTab
      key={channelId}
      title={channel.title}
      icon={
        isPublic ? <Icon which={icons.earth} /> : <Icon which={icons.lock} />
      }
      isActive={
        route.name === "channel" && route.params.channelId === channelId
      }
      isUnread={channel.isUnread}
      onClick={() => routes.channel({ channelId }).push()}
      onClose={() => context.channelStore.leave(channelId)}
    />
  )
}
