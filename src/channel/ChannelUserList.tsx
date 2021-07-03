import { sortBy } from "lodash-es"
import { useObservable } from "micro-observables"
import CharacterName from "../character/CharacterName"
import { useCharacterList, useGetCharacterRoles } from "../character/state"
import type { CharacterStatus } from "../character/types"
import type { ValueOf } from "../common/types"
import VirtualizedList from "../ui/VirtualizedList"
import type { ChannelModel } from "./ChannelModel"

interface Props {
	channel: ChannelModel
}

const itemTypes = [
	"friend",
	"bookmark",
	"admin",
	"op",
	"looking",
	"default",
] as const
type ItemType = ValueOf<typeof itemTypes>

function ChannelUserList({ channel }: Props) {
	const users = useObservable(channel.users)
	const ops = useObservable(channel.ops)

	const characters = useCharacterList(users)
	const getRoles = useGetCharacterRoles()

	const getItemType = (name: string, status: CharacterStatus): ItemType => {
		const roles = getRoles(name)
		if (roles.isAdmin) return "admin"
		if (ops.includes(name)) return "op"
		if (roles.isBookmarked) return "bookmark"
		if (roles.isFriend) return "friend"
		if (status === "looking") return "looking"
		return "default"
	}

	const getTypeCss = (type: ItemType): string => {
		if (type === "admin") return `bg-red-500 bg-opacity-20`
		if (type === "op") return `bg-yellow-500 bg-opacity-20`
		if (type === "friend") return `bg-green-500 bg-opacity-20`
		if (type === "bookmark") return `bg-blue-500 bg-opacity-20`
		return ""
	}

	const entries = characters.map(({ name, status }) => ({
		name,
		status,
		type: getItemType(name, status),
		className: getTypeCss(getItemType(name, status)),
	}))

	const sortedItems = sortBy(entries, ["order", (it) => it.name.toLowerCase()])

	return (
		<div className={`flex flex-col h-full`}>
			<div className={`px-3 py-2 bg-midnight-0`}>
				Characters: {entries.length}
			</div>
			<div className={`flex-1 min-h-0 bg-midnight-1`} role="list">
				<VirtualizedList
					items={sortedItems}
					itemSize={32}
					getItemKey={(item) => item.name}
					renderItem={({ item, style }) => (
						<div
							role="listitem"
							style={style}
							className={`${`flex items-center px-2`} ${item.className}`}
						>
							<CharacterName name={item.name} />
						</div>
					)}
				/>
			</div>
		</div>
	)
}

export default ChannelUserList
