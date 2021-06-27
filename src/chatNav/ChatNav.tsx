import type { ReactNode } from "react"
import CharacterSummary from "../character/CharacterSummary"
import type { Character } from "../chat/state"
import RoomTabList from "./RoomTabList"

export default function ChatNav({
	identityCharacter,
	children,
}: {
	identityCharacter: Character
	children: ReactNode
}) {
	return (
		<nav className={`flex h-full bg-midnight-2`}>
			<div className={`flex flex-col`}>{children}</div>
			<div className={`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<CharacterSummary
					character={identityCharacter}
					className={`p-3 mb-1 bg-midnight-0`}
				/>
				<div className={`flex-1`}>
					<RoomTabList />
				</div>
			</div>
		</nav>
	)
}
