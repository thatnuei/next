import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import EmptyState from "../ui/EmptyState"
import NotificationCard from "./NotificationCard"

export default function NotificationList() {
  const context = useChatContext()
  const notifications = useStoreValue(context.notificationStore.notifications)

  return notifications.length > 0 ? (
    <ul className="flex flex-col gap-1">
      {notifications.map((notification) => (
        <li key={notification.id} className="relative flex bg-midnight-1">
          {notification.readStatus === "read" ? null : (
            <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 opacity-50" />
          )}
          <div className="flex-1">
            <NotificationCard
              details={notification.details}
              timestamp={notification.timestamp}
            />
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <EmptyState />
  )
}
