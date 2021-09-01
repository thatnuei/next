import Avatar from "../character/Avatar"
import { useNickname } from "../character/nicknames"
import { useChatContext } from "../chat/ChatContext"
import RoomTab from "../chat/RoomTab"
import { routes, useRoute } from "../router"
import type { Store } from "../state/store"
import { useStoreValue } from "../state/store"
import type { PrivateChat } from "./types"

export default function PrivateChatTabList() {
  const context = useChatContext()
  const openChatNames = useStoreValue(context.privateChatStore.openChatNames)
  return (
    <>
      {Object.keys(openChatNames).map((name) => (
        <PrivateChatTab
          key={name}
          privateChat={context.privateChatStore.privateChats.selectItem(name)}
          onClose={() => context.privateChatStore.closeChat(name)}
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
