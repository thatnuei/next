import type { ReactNode } from "react"
import Button from "../dom/Button"
import { solidButton } from "../ui/components"
import LoadingOverlay from "../ui/LoadingOverlay"
import type { SocketConnectionStatus } from "./useSocketConnection"

export default function ConnectionGuard({
	status,
	onRetry,
	children,
}: {
	status: SocketConnectionStatus
	onRetry: () => void
	children: ReactNode
}) {
	switch (status) {
		case "connecting":
			return <LoadingOverlay text="Connecting..." />

		case "identifying":
			return <LoadingOverlay text="Identifying..." />

		case "closed":
			return (
				<ConnectionMessage
					message="The socket connection was closed by the server."
					onRetry={onRetry}
				/>
			)

		case "error":
			return (
				<ConnectionMessage
					message="An error occurred while connecting"
					onRetry={onRetry}
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
