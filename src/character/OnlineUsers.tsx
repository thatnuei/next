import clsx from "clsx"
import { atom, useAtom } from "jotai"
import TextInput from "../dom/TextInput"
import { input } from "../ui/components"
import Icon from "../ui/Icon"
import { bookmark, heart } from "../ui/icons"
import VirtualizedList from "../ui/VirtualizedList"
import CharacterName from "./CharacterName"
import {
	useBookmarkCharacters,
	useFriendCharacters,
	useSearchedCharacters,
} from "./state"
import type { Character } from "./types"

interface ListItem {
	type: "friend" | "bookmark" | "searched"
	character: Character
}

const searchAtom = atom("")

export default function OnlineUsers() {
	const friends = useFriendCharacters()
	const bookmarks = useBookmarkCharacters()

	const [search, setSearch] = useAtom(searchAtom)
	const searchedCharacters = useSearchedCharacters(searchAtom)

	const listItems: ListItem[] = search.trim()
		? searchedCharacters.map((character) => ({ type: "searched", character }))
		: [
				...friends.map(
					(character): ListItem => ({ type: "friend", character }),
				),
				...bookmarks.map(
					(character): ListItem => ({ type: "bookmark", character }),
				),
		  ]

	return (
		<div className="flex flex-col h-full bg-midnight-2">
			<section className="flex-1 min-h-0 ">
				<VirtualizedList
					items={listItems}
					itemSize={40}
					getItemKey={(item) => `${item.character.name}-${item.type}`}
					renderItem={({ item, style }) => (
						<div
							style={style}
							className={clsx(
								"flex items-center px-2 justify-between",
								item.type === "friend" && "bg-green-400/10",
								item.type === "bookmark" && "bg-blue-400/10",
							)}
						>
							<CharacterName name={item.character.name} />
							{item.type === "friend" && (
								<span className="text-green-300 opacity-50">
									<Icon which={heart} />
								</span>
							)}
							{item.type === "bookmark" && (
								<span className="text-blue-300 opacity-50">
									<Icon which={bookmark} />
								</span>
							)}
						</div>
					)}
				/>
			</section>

			{search.trim() ? (
				<p className="p-2 text-sm italic text-center opacity-50">
					{listItems.length || "No"} result(s)
				</p>
			) : null}

			<section className="flex flex-row p-2 space-x-2 bg-midnight-0">
				<TextInput
					type="text"
					aria-label="Search"
					placeholder="Enter a character name, or try 'looking' or 'female'"
					className={clsx(input, `flex-1`)}
					value={search}
					onChangeText={setSearch}
				/>
			</section>
		</div>
	)
}
