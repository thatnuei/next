import Avatar from "../character/Avatar"
import { useNickname } from "../character/nicknames"
import RoomTab from "../chat/RoomTab"
import { routes, useRoute } from "../router"
import type { Store } from "../state/store"
import { useStoreValue } from "../state/store"
import type { PrivateChatStore } from "./PrivateChatStore"
import type { PrivateChat } from "./types"

export default function PrivateChatTabList({
  privateChatStore,
}: {
  privateChatStore: PrivateChatStore
}) {
  const openChatNames = useStoreValue(privateChatStore.openChatNames)
  return (
    <>
      {Object.keys(openChatNames).map((name) => (
        <PrivateChatTab
          key={name}
          privateChat={privateChatStore.privateChats.selectItem(name)}
          onClose={() => privateChatStore.closeChat(name)}
        />
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
