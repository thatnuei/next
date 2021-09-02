import { useChatContext } from "../chat/ChatContext"
import ChatNavAction from "../chat/ChatNavAction"
import { routes, useRoute } from "../router"
import { useStoreValue } from "../state/store"
import BellBadgeIcon from "../ui/BellBadgeIcon"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"

export default function NotificationListLink() {
  const context = useChatContext()
  const hasUnreadNotifications = useStoreValue(
    context.notificationStore.selectHasUnread(),
  )
  const route = useRoute()

  return (
    <a {...routes.notifications().link}>
      <ChatNavAction
        icon={
          hasUnreadNotifications ? (
            <BellBadgeIcon className="text-blue-400" />
          ) : (
            <Icon which={icons.bell} />
          )
        }
        name="Notifications"
        active={route.name === "notifications"}
      />
    </a>
  )
}
