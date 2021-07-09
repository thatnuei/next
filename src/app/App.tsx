import { createContext, lazy, Suspense, useCallback } from "react"
import { useAuthUserContext } from "../chat/authUserContext"
import { useIdentityState } from "../chat/identityContext"
import { useSocketActions } from "../socket/SocketConnection"
import IslandLayout from "../ui/IslandLayout"
import LoadingOverlay from "../ui/LoadingOverlay"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

const Chat = lazy(() => import("../chat/Chat"))

export const ChatLogoutContext = createContext(() => {})

export default function App() {
	const { user, logout } = useAuthUserContext()
	const [identity, setIdentity] = useIdentityState()
	const { connect } = useSocketActions()

	const showCharacterSelect = useCallback(() => {
		setIdentity(undefined)
	}, [setIdentity])

	const enterChat = useCallback(
		(identity: string) => {
			setIdentity(identity)
			connect(identity)
		},
		[connect, setIdentity],
	)

	if (!user) {
		return (
			<IslandLayout title="Login" isVisible>
				<Login />
			</IslandLayout>
		)
	}

	if (!identity) {
		return (
			<IslandLayout title="Select a character" isVisible>
				<CharacterSelect
					account={user.account}
					characters={user.characters}
					onReturnToLogin={logout}
					onSubmit={enterChat}
				/>
			</IslandLayout>
		)
	}

	return (
		<ChatLogoutContext.Provider value={showCharacterSelect}>
			<Suspense fallback={<LoadingOverlay text="Loading..." />}>
				<Chat />
			</Suspense>
		</ChatLogoutContext.Provider>
	)
}
