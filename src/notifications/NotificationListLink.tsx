import ChatNavAction from "../chatNav/ChatNavAction"
import { routes, useRoute } from "../router"
import BellBadgeIcon from "../ui/BellBadgeIcon"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useUnreadNotificationCount } from "./state"

export default function NotificationListLink() {
	const route = useRoute()
	const count = useUnreadNotificationCount()

	return (
		<a {...routes.notifications().link}>
			<ChatNavAction
				icon={
					count > 0 ? (
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
