import type { ReactNode } from "react"
import {
	createContext,
	startTransition,
	useCallback,
	useContext,
	useState,
} from "react"
import { useChannelActions } from "../channel/state"
import { raise } from "../common/raise"
import { usePrivateChatActions } from "../privateChat/state"
import { createCommandHandler } from "../socket/helpers"
import { useSocketListener } from "../socket/SocketConnection"

interface ChatNavView {
	channelId?: string
	privateChatPartner?: string
}

const Context = createContext<{
	view?: ChatNavView | undefined
	showChannel: (channelId: string) => void
	showPrivateChat: (privateChatPartner: string) => void
}>()

export function ChatNavProvider({ children }: { children: ReactNode }) {
	const [view, setView] = useState<ChatNavView>()
	const { updateChannel } = useChannelActions()
	const { openPrivateChat, setPrivateChatIsUnread } = usePrivateChatActions()

	const showChannel = useCallback(
		(channelId: string) => {
			void updateChannel({ id: channelId, isUnread: false })

			startTransition(() => {
				setView({ channelId })
			})
		},
		[updateChannel],
	)

	const showPrivateChat = useCallback(
		(partnerName: string) => {
			setPrivateChatIsUnread({ partnerName, isUnread: false })
			openPrivateChat(partnerName)

			startTransition(() => {
				setView({ privateChatPartner: partnerName })
			})
		},
		[openPrivateChat, setPrivateChatIsUnread],
	)

	useSocketListener(
		createCommandHandler({
			MSG({ channel: channelId }) {
				if (view?.channelId !== channelId) {
					updateChannel({ id: channelId, isUnread: true })
				}
			},
			PRI({ character }) {
				if (view?.privateChatPartner !== character) {
					setPrivateChatIsUnread({ partnerName: character, isUnread: true })
				}
			},
		}),
	)

	return (
		<Context.Provider value={{ view, showChannel, showPrivateChat }}>
			{children}
		</Context.Provider>
	)
}

export function useChatNav() {
	return useContext(Context) ?? raise("ChatNavProvider not found")
}
