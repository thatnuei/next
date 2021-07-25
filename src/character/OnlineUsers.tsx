import clsx from "clsx"
import { atom, useAtom } from "jotai"
import { sortBy } from "lodash-es"
import { observer } from "mobx-react-lite"
import type { ReactNode } from "react"
import { useDeferredValue } from "react"
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
	containerClassName?: string
	icon?: ReactNode
}

const searchAtom = atom("")

export default observer(function OnlineUsers() {
	const friends = useFriendCharacters()
	const bookmarks = useBookmarkCharacters()

	const [search, setSearch] = useAtom(searchAtom)
	const searchedCharacters = useSearchedCharacters(search)

	const sortByName = (characters: readonly Character[]) =>
		sortBy(characters, (character) => character.name.toLowerCase())

	const getFriendItems = (): ListItem[] =>
		sortByName(friends).map((character) => ({
			character,
			type: "friend",
			containerClassName: "bg-green-400/10",
			icon: (
				<span className="opacity-50 text-green-300">
					<Icon which={heart} />
				</span>
			),
		}))

	const getBookmarkItems = (): ListItem[] =>
		sortByName(bookmarks).map((character) => ({
			character,
			type: "bookmark",
			containerClassName: "bg-blue-400/10",
			icon: (
				<span className="opacity-50 text-blue-300">
					<Icon which={bookmark} />
				</span>
			),
		}))

	const listItems: ListItem[] = useDeferredValue(
		search.trim()
			? searchedCharacters.map((character) => ({
					type: "searched",
					character,
			  }))
			: [...getFriendItems(), ...getBookmarkItems()],
	)

	return (
		<div className="flex flex-col h-full bg-midnight-2">
			<section className="flex-1 min-h-0">
				<VirtualizedList
					items={listItems}
					itemSize={40}
					getItemKey={(item) => `${item.character.name}-${item.type}`}
					renderItem={({ item, style }) => (
						<div
							style={style}
							className={clsx(
								"flex items-center px-2 justify-between",
								item.containerClassName,
							)}
						>
							<CharacterName name={item.character.name} />
							{item.icon}
						</div>
					)}
				/>
			</section>

			<p className="text-sm text-center opacity-50 p-2 italic">
				{listItems.length || "No"} result(s)
			</p>

			<section className="flex flex-row space-x-2 bg-midnight-0 p-2">
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
})
