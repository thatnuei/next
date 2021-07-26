import CharacterName from "../character/CharacterName"
import { useLikedCharacters } from "../character/state"
import type { Character } from "../character/types"
import { useNotificationActions } from "../notifications/state"
import { useSocketActions } from "../socket/SocketConnection"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import type { RenderItemInfo } from "../ui/VirtualizedList"
import VirtualizedList from "../ui/VirtualizedList"

interface Props {
	channelId: string
}

// need to have a list of all online character names in order to make them searchable,
// do that later
function InviteUsersForm({ channelId }: Props) {
	const { send } = useSocketActions()
	const characters = useLikedCharacters()
	const notificationActions = useNotificationActions()

	const sendInvite = (name: string) => {
		send({
			type: "CIU",
			params: { channel: channelId, character: name },
		})

		notificationActions.addNotification({
			type: "info",
			message: `Sent an invitation to ${name}`,
			save: false,
			showToast: true,
			toastDuration: 5000,
		})
	}

	const renderItem = ({ item, style }: RenderItemInfo<Character>) => (
		<div className={`flex flex-row items-center px-3 py-2`} style={style}>
			<div className="flex-1">
				<CharacterName name={item.name} />
			</div>
			<button
				className={`${fadedButton} flex flex-row ml-2`}
				onClick={() => sendInvite(item.name)}
			>
				<Icon which={icons.invite} />
				<span className={`ml-2`}>Invite</span>
			</button>
		</div>
	)

	return (
		<>
			<div className={`bg-midnight-2`} style={{ height: `calc(100vh - 8rem)` }}>
				<VirtualizedList
					items={characters.filter((c) => c.status === "online")}
					itemSize={40}
					getItemKey={(it) => it.name}
					renderItem={renderItem}
				/>
			</div>
			{/* <div className={`m-2`}>
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          type="text"
          className={input}
          placeholder="Search..."
        />
      </div> */}
		</>
	)
}

export default InviteUsersForm
