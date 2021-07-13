import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterSummary from "../character/CharacterSummary"
import ChatNavAction from "../chat/ChatNavAction"
import ChatNavActionButton from "../chat/ChatNavActionButton"
import RoomTabList from "../chat/RoomTabList"
import NotificationListLink from "../notifications/NotificationListLink"
import { routes } from "../router"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import { useIdentity } from "../user"
import StatusUpdateForm from "./StatusUpdateForm"

export default function ChatNav() {
	const identity = useIdentity()

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
