import { createContext, lazy, Suspense, useCallback, useState } from "react"
import { useAuthUserContext } from "../chat/authUserContext"
import { IdentityProvider } from "../chat/identityContext"
import IslandLayout from "../ui/IslandLayout"
import LoadingOverlay from "../ui/LoadingOverlay"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

const Chat = lazy(() => import("../chat/Chat"))

export const ChatLogoutContext = createContext(() => {})

export default function App() {
	const { user, logout } = useAuthUserContext()
	const [identity, setIdentity] = useState<string>()

	const showCharacterSelect = useCallback(() => {
		setIdentity(undefined)
	}, [])

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
					onSubmit={setIdentity}
				/>
			</IslandLayout>
		)
	}

	return (
		<IdentityProvider identity={identity}>
			<ChatLogoutContext.Provider value={showCharacterSelect}>
				<Suspense fallback={<LoadingOverlay text="Loading..." />}>
					<Chat />
				</Suspense>
			</ChatLogoutContext.Provider>
		</IdentityProvider>
	)
}
