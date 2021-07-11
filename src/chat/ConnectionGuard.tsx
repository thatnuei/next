import type { ReactNode } from "react"
import { useContext } from "react"
import { ChatLogoutContext } from "../app/App"
import Button from "../dom/Button"
import { useSocketStatus } from "../socket/SocketConnection"
import { solidButton } from "../ui/components"
import LoadingOverlay, { LoadingOverlayText } from "../ui/LoadingOverlay"
import { useAuthUserContext } from "./authUserContext"

export default function ConnectionGuard({ children }: { children: ReactNode }) {
	const status = useSocketStatus()
	const authUserActions = useAuthUserContext()
	const chatLogout = useContext(ChatLogoutContext)

	switch (status) {
		case "connecting":
		case "willReconnect":
			return (
				<LoadingOverlay>
					<LoadingOverlayText>Connecting...</LoadingOverlayText>
				</LoadingOverlay>
			)

		case "identifying":
			return (
				<LoadingOverlay>
					<LoadingOverlayText>Identifying...</LoadingOverlayText>
				</LoadingOverlay>
			)

		case "closed":
			return (
				<ConnectionMessage message="The connection was closed by the server.">
					<Button
						className={solidButton}
						onClick={() => {
							authUserActions.logout()
							chatLogout()
						}}
					>
						Return to login
					</Button>
				</ConnectionMessage>
			)
	}

	if (status !== "online") {
		return null
	}

	return <>{children}</>
}

function ConnectionMessage(props: { message: string; children?: ReactNode }) {
	return (
		<>
			<p>{props.message}</p>
			{props.children}
		</>
	)
}
