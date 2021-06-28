import { useCharacterCommandHandler } from "../character/state"
import type { AuthUser } from "../flist/types"
import ChatNav from "./ChatNav"
import ChatRoutes from "./ChatRoutes"
import ConnectionGuard from "./ConnectionGuard"
import { useIdentity } from "./identityContext"
import { useSocketConnection } from "./useSocketConnection"

export default function Chat({
	user,
	onLogout,
}: {
	user: AuthUser
	onLogout: () => void
}) {
	const identity = useIdentity()
	const handleCharacterCommand = useCharacterCommandHandler()

	const { status, connect } = useSocketConnection({
		user,
		identity,
		onCommand(command) {
			handleCharacterCommand(command, user)
		},
	})

	return (
		<ConnectionGuard status={status} onRetry={connect}>
			<div className="flex flex-row h-full gap-1">
				<ChatNav onLogout={onLogout} />
				<div className="flex-1">
					<ChatRoutes />
				</div>
			</div>
		</ConnectionGuard>
	)
}
