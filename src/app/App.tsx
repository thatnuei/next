import { useState } from "react"
import { createIdbStorage } from "../storage/idb"
import CharacterSelect from "./CharacterSelect"
import Chat from "../chat/Chat"
import Login, { LoginData } from "./Login"

type View =
	| { name: "login" }
	| { name: "characterSelect"; data: LoginData; initialCharacter: string }
	| { name: "chat"; data: LoginData; identity: string }

const storedIdentity = (account: string) =>
	createIdbStorage<string>(`identity:${account}`)

export default function App() {
	const [view, setView] = useState<View>({ name: "login" })

	switch (view.name) {
		case "login":
			return (
				<Login
					onSuccess={async (data) => {
						const lastIdentity = await storedIdentity(data.account)
							.get()
							.catch()

						setView({
							name: "characterSelect",
							data,
							initialCharacter: lastIdentity || data.characters[0],
						})
					}}
				/>
			)

		case "characterSelect":
			return (
				<CharacterSelect
					characters={view.data.characters}
					initialCharacter={view.initialCharacter}
					onChange={(identity) => {
						storedIdentity(view.data.account).set(identity)
					}}
					onSubmit={(identity) => {
						setView({ ...view, name: "chat", identity })
					}}
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
