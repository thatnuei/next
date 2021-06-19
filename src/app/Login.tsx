import * as React from "react"
import { useState } from "react"
import { extractErrorMessage } from "../common/extractErrorMessage"
import Button from "../dom/Button"
import { useRootStore } from "../root/context"
import { input, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

export type LoginResult = {
	account: string
	ticket: string
	characters: string[]
}

type State =
	| { current: "idle" }
	| { current: "loading" }
	| { current: "error"; error: string }

export default function Login() {
	const root = useRootStore()
	const [state, setState] = useState<State>({ current: "idle" })
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")

	const canSubmit =
		account !== "" && password !== "" && state.current !== "loading"

	const isFormDisabled = state.current === "loading"

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		if (state.current === "loading") return
		setState({ current: "loading" })

		root.appStore.submitLogin({ account, password }).catch((error) => {
			setState({ current: "error", error: extractErrorMessage(error) })
		})
	}

	return (
		<form className="flex flex-col items-start p-4 space-y-4" onSubmit={handleSubmit}>
			<FormField labelText="Username">
				<input
					className={input}
					type="text"
					placeholder="awesome username"
					value={account}
					onChange={(e) => setAccount(e.target.value)}
					disabled={isFormDisabled}
				/>
			</FormField>

			<FormField labelText="Password">
				<input
					className={input}
					type="password"
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={isFormDisabled}
				/>
			</FormField>

			<Button className={solidButton} type="submit" disabled={!canSubmit}>
				Log in
			</Button>

			{state.current === "error" && <p className="max-w-xs">{state.error}</p>}
		</form>
	)
}
