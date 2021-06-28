import CharacterSummary from "../character/CharacterSummary"
import { ChatNavAction } from "../chatNav/ChatNavAction"
import RoomTabList from "../chatNav/RoomTabList"
import * as icons from "../ui/icons"
import type { ChatState } from "./state"
import { getCharacter } from "./state"

export default function ChatNav({
	state,
	identity,
	onLogout,
}: {
	state: ChatState
	identity: string
	onLogout: () => void
}) {
	return (
		<nav className={`flex h-full bg-midnight-2`}>
			<div className={`flex flex-col`}>
				<ChatNavAction icon={icons.list} name="Browse channels" />
				<ChatNavAction icon={icons.updateStatus} name="Update your status" />
				<ChatNavAction
					icon={icons.users}
					name="See online friends and bookmarks"
				/>
				<ChatNavAction icon={icons.about} name="About next" />
				<div className={`flex-1`} />
				<ChatNavAction icon={icons.logout} name="Log out" onClick={onLogout} />
			</div>
			<div className={`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<CharacterSummary
					character={getCharacter(state, identity)}
					className={`p-3 mb-1 bg-midnight-0`}
				/>
				<div className={`flex-1`}>
					<RoomTabList />
				</div>
			</div>
		</nav>
	)
}
