import EmptyState from "../ui/EmptyState"
import NotificationCard from "./NotificationCard"
import { useNotificationList } from "./state"

export default function NotificationList() {
	const notifications = useNotificationList()

	return notifications.length > 0 ? (
		<ul className="flex flex-col gap-1 ">
			{notifications.map((notification) => (
				<li key={notification.id} className="bg-midnight-1">
					<NotificationCard
						notification={notification}
						timestamp={notification.timestamp}
					/>
				</li>
			))}
		</ul>
	) : (
		<EmptyState />
	)
}
