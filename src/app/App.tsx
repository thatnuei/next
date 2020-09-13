import { useState } from "react"
import CharacterSelect from "./CharacterSelect"
import Chat from "./Chat"
import Login, { LoginData } from "./Login"

type View =
	| { name: "login" }
	| { name: "characterSelect"; data: LoginData }
	| { name: "chat"; data: LoginData; identity: string }

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
					onSubmit={(identity) => setView({ ...view, name: "chat", identity })}
					onBack={() => setView({ name: "login" })}
				/>
			)

		case "chat": {
			const {
				data: { account, ticket },
				identity,
			} = view

			return <Chat {...{ account, ticket, identity }} />
		}
	}
}
