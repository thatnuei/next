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
import { useRootStore } from "../root/context"
import { createCommandHandler } from "../socket/helpers"
import { usePubSubListener } from "../state/pubsub"

interface ChatNavView {
	channelId?: string
	privateChatPartner?: string
}

const Context = createContext<{
	view?: ChatNavView
	showChannel: (channelId: string) => void
	showPrivateChat: (privateChatPartner: string) => void
}>()

export function ChatNavProvider({ children }: { children: ReactNode }) {
	const root = useRootStore()
	const [view, setView] = useState<ChatNavView>()
	const { updateChannel } = useChannelActions()

	const showChannel = useCallback(
		(channelId: string) => {
			updateChannel(channelId, { isUnread: false })
			startTransition(() => {
				setView({ channelId })
			})
		},
		[updateChannel],
	)

	const showPrivateChat = useCallback(
		(privateChatPartner: string) => {
			root.privateChatStore.getChat(privateChatPartner).isUnread.set(false)
			root.privateChatStore.open(privateChatPartner)

			startTransition(() => {
				setView({ privateChatPartner })
			})
		},
		[root.privateChatStore],
	)

	usePubSubListener(
		root.socket.commands,
		createCommandHandler({
			MSG({ channel: channelId }) {
				if (view?.channelId !== channelId) {
					updateChannel(channelId, { isUnread: true })
				}
			},
			PRI({ character }) {
				if (view?.privateChatPartner !== character) {
					root.privateChatStore.getChat(character).isUnread.set(true)
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
