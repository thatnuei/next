import { useObservable } from "micro-observables"
import * as React from "react"
import { tw } from "twind"
import Button from "../dom/Button"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Menu, { MenuButton, MenuItem, MenuPanel } from "../ui/Menu"
import CharacterMemoInput from "./CharacterMemoInput"
import CharacterSummary from "./CharacterSummary"

type Props = { name: string } & TagProps<"button">

export default function CharacterMenuTarget({ name, ...props }: Props) {
	return (
		<Menu>
			<MenuButton>
				<Button {...props} />
			</MenuButton>
			<MenuPanel>
				<CharacterMenu name={name} />
			</MenuPanel>
		</Menu>
	)
}

function CharacterMenu({ name }: { name: string }) {
	const root = useRootStore()

	const bookmarks = useObservable(root.characterStore.bookmarks)
	const isBookmarked = bookmarks.includes(name)

	const friends = useObservable(root.characterStore.friends)
	const friendshipItems = friends.filter((it) => it.them === name)

	const ignored = useObservable(root.characterStore.ignored)
	const isIgnored = ignored.includes(name)

	return (
		<>
			<div className={tw`p-3 space-y-3 bg-midnight-0`}>
				<CharacterSummary name={name} />

				{friendshipItems.map((item, index) => (
					<div
						key={index}
						className={tw`flex flex-row items-center px-2 py-1 space-x-1 text-sm text-green-400 bg-green-500 bg-opacity-20`}
					>
						<Icon which={icons.heart} />
						<div>{item.us}</div>
					</div>
				))}
			</div>

			<div className={tw`flex flex-col`}>
				<MenuItem icon={<Icon which={icons.link} />}>
					<ExternalLink href={getProfileUrl(name)}>Profile</ExternalLink>
				</MenuItem>

				<MenuItem icon={<Icon which={icons.message} />}>
					<Button onClick={() => root.chatNavStore.showPrivateChat(name)}>
						Message
					</Button>
				</MenuItem>

				<MenuItem
					icon={
						<Icon
							which={isBookmarked ? icons.bookmark : icons.bookmarkHollow}
						/>
					}
					stayOpenOnClick
				>
					<Button
						onClick={() => {
							if (isBookmarked) {
								root.userStore.removeBookmark({ name }).catch(console.error) // show error toast
							} else {
								root.userStore.addBookmark({ name }).catch(console.error) // show error toast
							}
						}}
					>
						{isBookmarked ? "Remove bookmark" : "Bookmark"}
					</Button>
				</MenuItem>

				<MenuItem
					icon={<Icon which={isIgnored ? icons.ignore : icons.ignoreHollow} />}
					stayOpenOnClick
				>
					<Button
						onClick={() => {
							root.socket.send({
								type: "IGN",
								params: {
									action: isIgnored ? "delete" : "add",
									character: name,
								},
							})
						}}
					>
						{isIgnored ? "Unignore" : "Ignore"}
					</Button>
				</MenuItem>
			</div>

			<div className={tw`p-2 bg-midnight-0`}>
				<CharacterMemoInput name={name} />
			</div>
		</>
	)
}
