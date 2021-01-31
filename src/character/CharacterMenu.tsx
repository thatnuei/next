import { useObservable } from "micro-observables"
import tw from "twin.macro"
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
		<Popover {...props} css={tw`w-56`}>
			<div css={tw`p-3 bg-background-0`}>
				<CharacterSummary name={name} />

				{friendshipItems.map((item, index) => (
					<div
						key={index}
						css={tw`flex flex-row items-center px-2 py-1 mt-3 text-sm bg-green-faded text-green`}
					>
						<Icon which={icons.heart} css={tw`w-4 h-4 mr-1`} />
						{item.us}
					</div>
				))}
			</div>

			<div css={tw`flex flex-col`}>
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
			<div css={tw`p-2 bg-background-0`}>
				<CharacterMemoInput name={name} css={tw`block w-full`} />
			</div>
		</Popover>
	)
}

export default CharacterMenu
