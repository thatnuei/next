import { createContext, useCallback, useEffect, useState } from "react"
import Chat from "../chat/Chat"
import { IdentityProvider } from "../chat/identityContext"
import type { AuthUser } from "../flist/types"
import { useShowToast } from "../toast/state"
import IslandLayout from "../ui/IslandLayout"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export const LogoutContext = createContext(() => {})

export default function App() {
	const [user, setUser] = useState<AuthUser>()
	const [identity, setIdentity] = useState<string>()
	const showToast = useShowToast()

	useEffect(() => {
		showToast({ type: "info", duration: 10000, content: "hi there" })
		showToast({ type: "success", duration: 10000, content: "hi there" })
		showToast({ type: "warning", duration: 10000, content: "hi there" })
		showToast({ type: "error", duration: 10000, content: "hi there" })
	})

	const logout = useCallback(() => {
		setIdentity(undefined)
	}, [])

	if (!user) {
		return (
			<IslandLayout title="Login" isVisible>
				<Login onSuccess={setUser} />
			</IslandLayout>
		)
	}

	if (!identity) {
		return (
			<IslandLayout title="Select a character" isVisible>
				<CharacterSelect
					account={user.account}
					characters={user.characters}
					onReturnToLogin={() => setUser(undefined)}
					onSubmit={setIdentity}
				/>
			</IslandLayout>
		)
	}

	return (
		<IdentityProvider identity={identity}>
			<LogoutContext.Provider value={logout}>
				<Chat user={user} />
			</LogoutContext.Provider>
		</IdentityProvider>
	)
}
