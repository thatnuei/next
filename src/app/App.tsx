import { createContext, useCallback, useState } from "react"
import { useAuthUserContext } from "../chat/authUserContext"
import Chat from "../chat/Chat"
import { IdentityProvider } from "../chat/identityContext"
import IslandLayout from "../ui/IslandLayout"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export const LogoutContext = createContext(() => {})

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
				<Chat />
			</ChatLogoutContext.Provider>
		</IdentityProvider>
	)
}
