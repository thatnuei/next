import { useState } from "react"
import CharacterSelect from "./CharacterSelect"
import Login, { LoginData } from "./Login"

type View =
	| { name: "login" }
	| { name: "characterSelect"; data: LoginData }
	| { name: "chat" }

export default function App() {
	const [view, setView] = useState<View>({ name: "login" })

	switch (view.name) {
		case "login":
			return (
				<Login
					onSuccess={(data) => {
						setView({ name: "characterSelect", data })
					}}
				/>
			)

		case "characterSelect":
			return (
				<CharacterSelect
					characters={view.data.characters}
					onSubmit={() => setView({ name: "chat" })}
					onBack={() => setView({ name: "login" })}
				/>
			)

		case "chat":
			return <p>chat</p>
	}
}
