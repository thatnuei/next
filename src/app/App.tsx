import { useState } from "react"
import Chat from "../chat/Chat"
import type { AuthUser } from "../flist/types"
import IslandLayout from "../ui/IslandLayout"
import CharacterSelect from "./CharacterSelect"
import Login from "./Login"

export default function App() {
	const [user, setUser] = useState<AuthUser>()
	const [identity, setIdentity] = useState<string>()

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
					characters={user.characters}
					onReturnToLogin={() => setUser(undefined)}
					onSubmit={setIdentity}
				/>
			</IslandLayout>
		)
	}

	return <Chat user={user} identity={identity} />
}
