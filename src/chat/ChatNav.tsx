import { useContext } from "react"
import { ChatLogoutContext } from "../app/App"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterSummary from "../character/CharacterSummary"
import ChatNavAction from "../chatNav/ChatNavAction"
import ChatNavActionButton from "../chatNav/ChatNavActionButton"
import RoomTabList from "../chatNav/RoomTabList"
import { useUnreadNotificationCount } from "../notifications/state"
import { routes, useRoute } from "../router"
import BellBadgeIcon from "../ui/BellBadgeIcon"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import { useIdentity } from "./identityContext"
import StatusUpdateForm from "./StatusUpdateForm"

export default function ChatNav() {
	const identity = useIdentity()
	const logout = useContext(ChatLogoutContext)
	const route = useRoute()

	return (
		<nav className={`flex h-full bg-midnight-2`}>
			<div className={`flex flex-col`}>
				<Modal
					title="Channel Browser"
					renderContent={() => <ChannelBrowser />}
					renderTrigger={(t) => (
						<ChatNavActionButton
							icon={<Icon which={icons.list} />}
							name="Browse channels"
							{...t}
						/>
					)}
				/>

				<Modal
					title="Status update"
					renderContent={({ close }) => <StatusUpdateForm onSuccess={close} />}
					renderTrigger={(t) => (
						<ChatNavActionButton
							icon={<Icon which={icons.updateStatus} />}
							name="Update your status"
							{...t}
						/>
					)}
				/>

				<NotificationListLink />

				<ChatNavActionButton
					icon={<Icon which={icons.users} />}
					name="See online friends and bookmarks"
				/>
				<ChatNavActionButton
					icon={<Icon which={icons.about} />}
					name="About next"
				/>
				<div className={`flex-1`} />
				<ChatNavActionButton
					icon={<Icon which={icons.logout} />}
					name="Log out"
					onClick={logout}
				/>
			</div>
			<div className={`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<div className={`p-2 mb-1 bg-midnight-0`}>
					<CharacterSummary name={identity} />
				</div>
				<div className={`flex-1`}>
					<RoomTabList />
				</div>
			</div>
		</nav>
	)
}

function NotificationListLink() {
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
