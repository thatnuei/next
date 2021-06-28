import { useEffect, useReducer } from "react"
import type { AuthUser } from "../flist/types"
import ChatNav from "./ChatNav"
import ChatRoutes from "./ChatRoutes"
import ConnectionGuard from "./ConnectionGuard"
import {
	chatStateReducer,
	initialChatState,
	serverCommandAction,
} from "./state"
import { useSocketConnection } from "./useSocketConnection"

export default function Chat({
	user,
	identity,
	onLogout,
}: {
	user: AuthUser
	identity: string
	onLogout: () => void
}) {
	const [state, dispatch] = useReducer(chatStateReducer, initialChatState)

	const { status, connect, disconnect } = useSocketConnection({
		onCommand(command) {
			if (identity) {
				dispatch(serverCommandAction({ command, identity }))
			}
		},
	})

	const retry = () => {
		connect(user.account, user.ticket, identity)
	}

	useEffect(() => {
		connect(user.account, user.ticket, identity)
	}, [connect, identity, user.account, user.ticket])

	useEffect(() => () => disconnect(), [disconnect])

	return (
		<ConnectionGuard status={status} onRetry={retry}>
			<div className="flex flex-row h-full gap-1">
				<ChatNav state={state} identity={identity} onLogout={onLogout} />
				<div className="flex-1">
					<ChatRoutes />
				</div>
			</div>
		</ConnectionGuard>
	)
}
