import { useState } from "react"
import CharacterSelect from "../modules/auth/CharacterSelect"
import Login from "../modules/auth/Login"
import { Session } from "../modules/auth/types"

export default function Index() {
	type Screen =
		| { name: "login" }
		| { name: "characterSelect"; session: Session; initialCharacter: string }
		| { name: "chat"; session: Session; identity: string }

	const [screen, setScreen] = useState<Screen>({ name: "login" })

	switch (screen.name) {
		case "login":
			return (
				<Login
					onSuccess={(session) => {
						setScreen({
							name: "characterSelect",
							session,
							initialCharacter: session.characters[0],
						})
					}}
				/>
			)

		case "characterSelect":
			return (
				<CharacterSelect
					characters={screen.session.characters}
					initialCharacter={screen.initialCharacter}
					onSubmit={(identity) => {
						setScreen({
							name: "chat",
							session: screen.session,
							identity,
						})
					}}
				/>
			)

		case "chat":
			return <p>chat</p>
	}
}
