import type { ReactNode } from "react"
import { useContext } from "react"
import Button from "../dom/Button"
import {
	SocketStatusContext,
	useSocketActions,
} from "../socket/SocketConnection"
import { solidButton } from "../ui/components"
import LoadingOverlay from "../ui/LoadingOverlay"
import { useIdentity } from "./identityContext"

export default function ConnectionGuard({ children }: { children: ReactNode }) {
	const status = useContext(SocketStatusContext)
	const { connect } = useSocketActions()
	const identity = useIdentity()

	switch (status) {
		case "connecting":
			return <LoadingOverlay text="Connecting..." />

		case "identifying":
			return <LoadingOverlay text="Identifying..." />

		case "closed":
			return (
				<ConnectionMessage
					message="The socket connection was closed by the server."
					onRetry={() => connect(identity)}
				/>
			)

		case "error":
			return (
				<ConnectionMessage
					message="An error occurred while connecting"
					onRetry={() => connect(identity)}
				/>
			)
	}

	if (status !== "online") {
		return null
	}

	return <>{children}</>
}

function ConnectionMessage(props: { message: string; onRetry: () => void }) {
	return (
		<>
			<p>{props.message}</p>
			<Button className={solidButton} onClick={props.onRetry}>
				Retry
			</Button>
		</>
	)
}
