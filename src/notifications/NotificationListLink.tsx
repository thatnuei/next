import ChatNavAction from "../chat/ChatNavAction"
import { routes, useRoute } from "../router"
import BellBadgeIcon from "../ui/BellBadgeIcon"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useHasUnreadNotifications } from "./state"

export default function NotificationListLink() {
  const route = useRoute()
  const hasUnreadNotifications = useHasUnreadNotifications()

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
