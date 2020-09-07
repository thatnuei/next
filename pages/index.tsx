import { useState } from "react"
import Login from "../modules/auth/Login"
import { Session } from "../modules/auth/types"

export default function Index() {
	type Screen =
		| { name: "login" }
		| { name: "characterSelect"; session: Session }

	const [screen, setScreen] = useState<Screen>({ name: "login" })

	switch (screen.name) {
		case "login":
			return (
				<Login
					onSuccess={(session) => {
						setScreen({ name: "characterSelect", session })
					}}
				/>
			)

		case "characterSelect":
			return <p>char select</p>
	}
}
