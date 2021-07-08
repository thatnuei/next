import BBC from "../bbc/BBC"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import Icon from "../ui/Icon"
import { about } from "../ui/icons"
import type { Notification } from "./state"

export default function NotificationCard({
	notification,
}: {
	notification: Notification
}) {
	return (
		<div className="flex w-full gap-3 p-3 bg-midnight-0">
			{notification.actorName ? (
				<Avatar name={notification.actorName} size={10} />
			) : (
				<div className="grid w-10 h-10 place-content-center">
					<Icon which={about} size={8} />
				</div>
			)}
			<div className="flex flex-col self-center flex-1 gap-2">
				{notification.type === "broadcast" && notification.actorName ? (
					<h2 className="text-xs">
						Broadcast from{" "}
						<strong className="font-medium opacity-100">
							<CharacterName name={notification.actorName} statusDot="hidden" />
						</strong>
					</h2>
				) : notification.type === "broadcast" ? (
					<h2 className="text-xs">Broadcast</h2>
				) : null}
				<p className="flex-1">
					<BBC text={notification.message} />
				</p>
			</div>
		</div>
	)
}
