import { useContext } from "react"
import { LogoutContext } from "../app/App"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterSummary from "../character/CharacterSummary"
import { ChatNavAction } from "../chatNav/ChatNavAction"
import RoomTabList from "../chatNav/RoomTabList"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import { useIdentity } from "./identityContext"

export default function ChatNav() {
	const identity = useIdentity()
	const logout = useContext(LogoutContext)
	return (
		<nav className={`flex h-full bg-midnight-2`}>
			<div className={`flex flex-col`}>
				<Modal
					title="Channel Browser"
					renderTrigger={(t) => (
						<ChatNavAction icon={icons.list} name="Browse channels" {...t} />
					)}
				>
					<ChannelBrowser />
				</Modal>

				<ChatNavAction icon={icons.updateStatus} name="Update your status" />
				<ChatNavAction
					icon={icons.users}
					name="See online friends and bookmarks"
				/>
				<ChatNavAction icon={icons.about} name="About next" />
				<div className={`flex-1`} />
				<ChatNavAction icon={icons.logout} name="Log out" onClick={logout} />
			</div>
			<div className={`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<CharacterSummary
					name={identity}
					className={`p-3 mb-1 bg-midnight-0`}
				/>
				<div className={`flex-1`}>
					<RoomTabList />
				</div>
			</div>
		</nav>
	)
}
