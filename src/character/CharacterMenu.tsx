import clsx from "clsx"
import Button from "../dom/Button"
import ExternalLink from "../dom/ExternalLink"
import TextInput from "../dom/TextInput"
import { getProfileUrl } from "../flist/helpers"
import { usePrivateChatActions } from "../privateChat/state"
import { routes } from "../router"
import { useSocketActions } from "../socket/SocketConnection"
import { input } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useUserActions } from "../user"
import CharacterMemoInput from "./CharacterMemoInput"
import CharacterSummary from "./CharacterSummary"
import { useNickname, useSetNickname } from "./nicknames"
import { useCharacterRoles } from "./state"

const menuItemClass = clsx`
  p-2 
  flex items-center gap-2 
  transition-opacity
  opacity-50 hover:opacity-100
`

export default function CharacterMenu({ name }: { name: string }) {
	const { friendships, isBookmarked, isIgnored } = useCharacterRoles(name)
	const { send } = useSocketActions()
	const { addBookmark, removeBookmark } = useUserActions()
	const privateChatActions = usePrivateChatActions(name)

	return (
		<>
			<div className={`p-2 space-y-3 bg-midnight-0`}>
				<CharacterSummary name={name} />

				{friendships
					.filter(({ them }) => them === name)
					.map((item, index) => (
						<div
							key={index}
							className={`flex flex-row items-center px-2 py-1 space-x-1 text-sm text-green-400 bg-green-500 bg-opacity-20`}
						>
							<Icon which={icons.heart} />
							<div>{item.us}</div>
						</div>
					))}
			</div>

			<div className={`flex flex-col`}>
				<ExternalLink className={menuItemClass} href={getProfileUrl(name)}>
					<Icon which={icons.link} />
					Profile
				</ExternalLink>

				<Button
					className={menuItemClass}
					onClick={() => {
						routes.privateChat({ partnerName: name }).push()
						privateChatActions.open()
					}}
				>
					<Icon which={icons.message} />
					Message
				</Button>

				<Button
					className={menuItemClass}
					role="checkbox"
					aria-checked={isBookmarked}
					onClick={() => {
						if (isBookmarked) {
							removeBookmark({ name }).catch(console.error) // show error toast
						} else {
							addBookmark({ name }).catch(console.error) // show error toast
						}
					}}
				>
					<Icon which={isBookmarked ? icons.bookmark : icons.bookmarkHollow} />
					{isBookmarked ? "Remove bookmark" : "Bookmark"}
				</Button>

				<Button
					className={menuItemClass}
					role="checkbox"
					aria-checked={isIgnored}
					onClick={() => {
						send({
							type: "IGN",
							params: {
								action: isIgnored ? "delete" : "add",
								character: name,
							},
						})
					}}
				>
					<Icon which={isIgnored ? icons.ignore : icons.ignoreHollow} />
					{isIgnored ? "Unignore" : "Ignore"}
				</Button>
			</div>

			<div className="space-y-2 bg-midnight-0 p-2">
				<details>
					<summary className="cursor-pointer text-sm select-none">Memo</summary>
					<CharacterMemoInput name={name} />
				</details>

				<details>
					<summary className="cursor-pointer text-sm select-none">
						Nickname
					</summary>
					<p className="my-1 text-xs">
						This nickname will show instead of their actual character name.
					</p>
					<NicknameInput name={name} />
				</details>
			</div>
		</>
	)
}

function NicknameInput({ name }: { name: string }) {
	const nickname = useNickname(name)
	const setNickname = useSetNickname(name)
	return (
		<TextInput
			className={input}
			value={nickname || ""}
			onChangeText={setNickname}
			placeholder="Enter a nickname"
		/>
	)
}
