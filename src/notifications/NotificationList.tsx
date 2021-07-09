import NotificationCard from "./NotificationCard"
import { useNotificationList } from "./state"

export default function NotificationList() {
	const notifications = useNotificationList()

	return (
		<div className="bg-midnight-2">
			{notifications.length > 0 ? (
				<ul className="flex flex-col gap-1">
					{notifications.map((notification) => (
						<li key={notification.id}>
							<NotificationCard notification={notification} />
						</li>
					))}
				</ul>
			) : (
				<p className="p-8 text-xl italic text-center opacity-50 font-condensed">
					Nothing here!
				</p>
			)}
		</div>
	)
}
