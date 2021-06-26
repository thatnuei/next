import type { ReactNode } from "react"
import CharacterSummary from "../character/CharacterSummary"
import RoomTabList from "./RoomTabList"

export default function ChatNav({
	identity,
	children,
}: {
	identity: string
	children: ReactNode
}) {
	return (
		<nav className={`flex h-full bg-midnight-2`}>
			<div className={`flex flex-col`}>{children}</div>
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
