import BBC from "../bbc/BBC"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import Icon from "../ui/Icon"
import { about } from "../ui/icons"
import type { Notification } from "./state"
import { useNotificationList } from "./state"

export default function NotificationList() {
	const notifications = useNotificationList()

	return (
		<div className="bg-midnight-2">
			{notifications.length > 0 ? (
				<ul className="flex flex-col gap-2 p-2">
					{notifications.map((notification) => (
						<li key={notification.id}>
							<BroadcastNotificationCard notification={notification} />
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

function BroadcastNotificationCard({
	notification,
}: {
	notification: Notification
}) {
	return (
		<div className="flex w-full gap-3 p-3 transition-opacity opacity-75 bg-midnight-0 hover:opacity-100">
			{notification.actorName ? (
				<Avatar name={notification.actorName} size={10} />
			) : (
				<div className="grid w-10 h-10 place-content-center">
					<Icon which={about} size={8} />
				</div>
			)}
			<div className="flex-1">
				{notification.actorName ? (
					<h2 className="text-xs">
						Broadcast from{" "}
						<strong className="font-medium opacity-100">
							<CharacterName name={notification.actorName} statusDot="hidden" />
						</strong>
					</h2>
				) : (
					<h2 className="text-xs">Broadcast</h2>
				)}
				<p className="flex-1 mt-1">
					<BBC text={notification.message} />
				</p>
			</div>
		</div>
	)
}
