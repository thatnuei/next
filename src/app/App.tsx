import { createContext, useCallback, useState } from "react"
import { RecoilRoot } from "recoil"
import Chat from "../chat/Chat"
import { IdentityProvider } from "../chat/identityContext"
import type { AuthUser } from "../flist/types"
import IslandLayout from "../ui/IslandLayout"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export const LogoutContext = createContext(() => {})

export default function App() {
	const [user, setUser] = useState<AuthUser>()
	const [identity, setIdentity] = useState<string>()

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
		<RecoilRoot>
			<IdentityProvider identity={identity}>
				<LogoutContext.Provider value={logout}>
					<Chat user={user} />
				</LogoutContext.Provider>
			</IdentityProvider>
		</RecoilRoot>
	)
}
