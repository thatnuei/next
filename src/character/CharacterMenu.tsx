import { useObservable } from "micro-observables"
import { tw } from "twind"
import { getProfileUrl } from "../flist/helpers"
import { useRootStore } from "../root/context"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import MenuItem from "../ui/MenuItem"
import Popover, { PopoverProps } from "../ui/Popover"
import CharacterMemoInput from "./CharacterMemoInput"
import CharacterSummary from "./CharacterSummary"

function CharacterMenu({
	name,
	...props
}: Omit<PopoverProps, "children"> & { name: string }) {
	const root = useRootStore()

	const bookmarks = useObservable(root.characterStore.bookmarks)
	const isBookmarked = bookmarks.includes(name)

	const friends = useObservable(root.characterStore.friends)
	const friendshipItems = friends.filter((it) => it.them === name)

	const ignored = useObservable(root.characterStore.ignored)
	const isIgnored = ignored.includes(name)

	return (
		<Popover {...props} className={tw`w-56`}>
			<div className={tw`p-3 bg-midnight-0`}>
				<CharacterSummary name={name} />

				{friendshipItems.map((item, index) => (
					<div
						key={index}
						className={tw`flex flex-row items-center px-2 py-1 mt-3 text-sm bg-green-500 bg-opacity-20 text-green-400`}
					>
						<Icon which={icons.heart} className={tw`w-4 h-4 mr-1`} />
						{item.us}
					</div>
				))}
			</div>

			<div className={tw`flex flex-col`}>
				<MenuItem
					icon={icons.link}
					text="Profile"
					href={getProfileUrl(name)}
					onClick={props.onDismiss}
				/>
				<MenuItem
					icon={icons.message}
					text="Message"
					onClick={() => {
						props.onDismiss()
						root.chatNavStore.showPrivateChat(name)
					}}
				/>
				<MenuItem
					icon={isBookmarked ? icons.bookmark : icons.bookmarkHollow}
					text={isBookmarked ? "Remove bookmark" : "Bookmark"}
					onClick={() => {
						props.onDismiss()
						if (isBookmarked) {
							root.userStore.removeBookmark({ name }).catch(console.error) // show error toast
						} else {
							root.userStore.addBookmark({ name }).catch(console.error) // show error toast
						}
					}}
				/>
				<MenuItem
					icon={isIgnored ? icons.ignore : icons.ignoreHollow}
					text={isIgnored ? "Unignore" : "Ignore"}
					onClick={() => {
						root.socket.send({
							type: "IGN",
							params: {
								action: isIgnored ? "delete" : "add",
								character: name,
							},
						})
					}}
				/>
			</div>
			<div className={tw`p-2 bg-midnight-0`}>
				<CharacterMemoInput name={name} className={tw`block w-full`} />
			</div>
		</Popover>
	)
}

export default CharacterMenu
