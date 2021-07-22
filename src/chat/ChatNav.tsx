import AppInfo from "../app/AppInfo"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterSummary from "../character/CharacterSummary"
import OnlineUsers from "../character/OnlineUsers"
import ChatNavAction from "../chat/ChatNavAction"
import ChatNavActionButton from "../chat/ChatNavActionButton"
import RoomTabList from "../chat/RoomTabList"
import NotificationListLink from "../notifications/NotificationListLink"
import { routes, useRoute } from "../router"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import LogsIcon from "../ui/LogsIcon"
import Modal from "../ui/Modal"
import { useIdentity } from "../user"
import StatusUpdateForm from "./StatusUpdateForm"

export default function ChatNav() {
	const identity = useIdentity()
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
					title="Online Users"
					renderTrigger={(t) => (
						<ChatNavActionButton
							icon={<Icon which={icons.users} />}
							name="Online Users"
							{...t}
						/>
					)}
					renderContent={() => (
						<div className="h-[calc(100vh-8rem)]">
							<OnlineUsers />
						</div>
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

				<a {...routes.logs().link}>
					<ChatNavAction
						icon={<LogsIcon />}
						name="Logs"
						active={route.name === "logs"}
					/>
				</a>

				<Modal
					title="About next"
					renderTrigger={(t) => (
						<ChatNavActionButton
							icon={<Icon which={icons.about} />}
							name="About next"
							{...t}
						/>
					)}
					renderContent={() => (
						<div className="p-4">
							<AppInfo />
						</div>
					)}
				/>

				<div className={`flex-1`} />

				<a {...routes.login().link}>
					<ChatNavAction icon={<Icon which={icons.logout} />} name="Log out" />
				</a>
			</div>
			<div className={`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<div className={`p-2 mb-1 bg-midnight-0`}>
					{identity ? (
						<CharacterSummary name={identity} />
					) : (
						<p>Not logged in</p>
					)}
				</div>
				<div className={`flex-1`}>
					<RoomTabList />
				</div>
			</div>
		</nav>
	)
}
