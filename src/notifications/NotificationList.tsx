import EmptyState from "../ui/EmptyState"
import NotificationCard from "./NotificationCard"
import { useNotificationList } from "./state"

export default function NotificationList() {
  const notifications = useNotificationList()

  return notifications.length > 0 ? (
    <ul className="flex flex-col gap-1">
      {notifications.map((notification) => (
        <li key={notification.id} className="flex bg-midnight-1 relative">
          {notification.readStatus === "read" ? null : (
            <div className="bg-blue-500 opacity-50 inset-y-0 left-0 w-1 absolute" />
          )}
          <div className="flex-1">
            <NotificationCard
              notification={notification}
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
