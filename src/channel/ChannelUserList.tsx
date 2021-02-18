import { sortBy, zip } from "lodash-es"
import { Observable, useObservable } from "micro-observables"
import { tw } from "twind"
import { CharacterStatus } from "../character/CharacterModel"
import CharacterName from "../character/CharacterName"
import { isPresent } from "../common/isPresent"
import { ValueOf } from "../common/types"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import VirtualizedList from "../ui/VirtualizedList"
import { ChannelModel } from "./ChannelModel"

type Props = TagProps<"div"> & {
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

function ChannelUserList({ channel, ...props }: Props) {
	const users = useObservable(channel.users)
	const ops = useObservable(channel.ops)

	const root = useRootStore()
	const admins = useObservable(root.characterStore.admins)
	const bookmarks = useObservable(root.characterStore.bookmarks)
	const friends = useObservable(root.characterStore.friends)

	const isFriend = (name: string) => friends.some((f) => f.them === name)

	// technically we already have the name and don't need to observe it,
	// but it's probably slightly more correct? leaving this for now
	const namesObservable = Observable.merge(
		users.map(root.characterStore.getCharacter).map((char) => char.name),
	)

	const statusesObservable = Observable.merge(
		users.map(root.characterStore.getCharacter).map((char) => char.status),
	)

	const getItemType = (name: string, status: CharacterStatus): ItemType => {
		if (admins.includes(name)) return "admin"
		if (ops.includes(name)) return "op"
		if (isFriend(name)) return "friend"
		if (bookmarks.includes(name)) return "bookmark"
		if (status.type === "looking") return "looking"
		return "default"
	}

	const getTypeCss = (type: ItemType) => {
		if (type === "admin") return tw`bg-red-500 bg-opacity-20`
		if (type === "op") return tw`bg-yellow-500 bg-opacity-20`
		if (type === "friend") return tw`bg-green-500 bg-opacity-20`
		if (type === "bookmark") return tw`bg-blue-500 bg-opacity-20`
	}

	const entries = useObservable(
		Observable.from(namesObservable, statusesObservable).transform(
			([names, statuses]) =>
				zip(names, statuses)
					.map(([name, status]) => {
						if (!name || !status) return undefined
						const type = getItemType(name, status)
						return {
							name,
							status,
							order: itemTypes.indexOf(type),
							className: getTypeCss(type),
						}
					})
					.filter(isPresent),
		),
	)

	const sortedItems = sortBy(entries, ["order", (it) => it.name.toLowerCase()])

	return (
		<div className={tw`flex flex-col h-full`}>
			<div className={tw`px-3 py-2 bg-midnight-0`}>
				Characters: {entries.length}
			</div>
			<div className={tw`flex-1 min-h-0 bg-midnight-1`} role="list">
				<VirtualizedList
					items={sortedItems}
					itemSize={32}
					getItemKey={(item) => item.name}
					renderItem={({ item, style }) => (
						<div
							role="listitem"
							style={style}
							className={`${tw`flex items-center px-2`} ${item.className}`}
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
