import { uniqBy } from "lodash-es"
import { useObservable } from "micro-observables"
import { useMemo } from "react"
import { tw } from "twind"
import { CharacterModel } from "../character/CharacterModel"
import CharacterName from "../character/CharacterName"
import { useRootStore } from "../root/context"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList, { RenderItemInfo } from "../ui/VirtualizedList"

type Props = { channelId: string }

// need to have a list of all online character names in order to make them searchable,
// do that later
function InviteUsersForm({ channelId }: Props) {
	const root = useRootStore()

	// const [searchInput, setSearchInput] = useState("")

	const friends = useObservable(root.characterStore.friends)
	const bookmarks = useObservable(root.characterStore.bookmarks)

	const characterNames = useMemo(
		() => [...friends.map((it) => it.them), ...bookmarks],
		[bookmarks, friends],
	)

	// TODO: needs to be a proper observation
	const characters = characterNames.map(root.characterStore.getCharacter)

	// const matchesQuery = (it: CharacterState) =>
	//   fuzzysearch(searchInput.toLowerCase(), it.name.toLowerCase())

	// const getGroupOrder = (it: CharacterState) => {
	//   if (isFriend(friends)(it.name)) return 1
	//   if (bookmarks.includes(it.name)) return 2
	//   return 3
	// }

	// const users = (() => {
	//   const searchQuery = searchInput.toLowerCase().trim()

	//   if (!searchQuery) {
	//     const friendNames = sortBy(
	//       toLower,
	//       friends.map((it) => it.them),
	//     )

	//     const bookmarkNames = sortBy(toLower, bookmarks)

	//     return [...friendNames, ...bookmarkNames]
	//       .map(state.characters.get)
	//       .filter((char) => char.status !== "offline")
	//       .filter(matchesQuery)
	//   }

	//   return sortBy(
	//     [getGroupOrder, (it) => it.name.toLowerCase()],
	//     [...state.characters.values()].filter(matchesQuery),
	//   )
	// })()

	const sendInvite = (name: string) => {
		// untested lol!
		root.socket.send({
			type: "CIU",
			params: { channel: channelId, character: name },
		})
	}

	const renderItem = ({ item, style }: RenderItemInfo<CharacterModel>) => (
		<div className={tw`flex flex-row items-center px-3 py-2`} style={style}>
			<CharacterName name={item.name.get()} className={tw`flex-1`} />
			<button
				className={tw([fadedButton, tw`flex flex-row ml-2`])}
				onClick={() => sendInvite(item.name.get())}
			>
				<Icon which={icons.invite} />
				<span className={tw`ml-2`}>Invite</span>
			</button>
		</div>
	)

	return (
		<div className={tw`flex flex-col w-full h-full`}>
			<div className={tw`flex-1 bg-midnight-2`}>
				<VirtualizedList
					items={uniqBy(characters, "name")}
					itemSize={40}
					getItemKey={(it) => it.name.get()}
					renderItem={renderItem}
				/>
			</div>
			{/* <div className={tw`m-2`}>
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          type="text"
          className={input}
          placeholder="Search..."
        />
      </div> */}
		</div>
	)
}

export default InviteUsersForm
