import BBC from "../bbc/BBC"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import { statusColors } from "../character/colors"
import Timestamp from "../dom/Timestamp"
import Icon from "../ui/Icon"
import { about } from "../ui/icons"
import type { Notification } from "./state"

export default function NotificationCard({
	notification,
}: {
	notification: Notification
}) {
	switch (notification.type) {
		case "info":
		case "error":
			return (
				<NotificationCardBase
					message={notification.message}
					timestamp={notification.timestamp}
				/>
			)

		case "broadcast":
			return (
				<NotificationCardBase
					message={notification.message}
					avatarName={notification.actorName}
					timestamp={notification.timestamp}
					header={
						notification.actorName ? (
							<>
								Broadcast from{" "}
								<strong className="font-medium opacity-100">
									<CharacterName
										name={notification.actorName}
										statusDot="hidden"
									/>
								</strong>
							</>
						) : (
							"Broadcast"
						)
					}
				/>
			)

		case "status":
			return (
				<NotificationCardBase
					avatarName={notification.name}
					timestamp={notification.timestamp}
				>
					<CharacterName name={notification.name} statusDot="hidden" /> is now{" "}
					<span style={{ color: statusColors[notification.status] }}>
						{notification.status}
					</span>
					{notification.message ? (
						<>
							: <BBC text={notification.message} />
						</>
					) : null}
				</NotificationCardBase>
			)
	}
}

function NotificationCardBase({
	avatarName,
	header,
	message,
	children,
	timestamp,
}: {
	avatarName?: string
	header?: React.ReactNode
	message?: string
	children?: React.ReactNode
	timestamp: number
}) {
	return (
		<div className="flex w-full gap-3 p-3 ">
			{avatarName ? (
				<Avatar name={avatarName} size={8} />
			) : (
				<Icon which={about} size={8} />
			)}
			<div className="self-center flex-1 ">
				<Timestamp className="float-right text-xs italic opacity-75">
					{timestamp}
				</Timestamp>
				<div className="flex flex-col gap-1">
					{header ? <h2 className="text-xs">{header}</h2> : null}
					<p className="flex-1 leading-snug">
						{message ? <BBC text={message} /> : null}
						{children}
					</p>
				</div>
			</div>
		</div>
	)
}
