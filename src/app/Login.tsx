import { useState } from "react"
import { useAuthUserContext } from "../chat/authUserContext"
import Button from "../dom/Button"
import { preventDefault } from "../react/preventDefault"
import usePromiseState from "../state/usePromiseState"
import { input, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

export default function Login() {
	const { login } = useAuthUserContext()
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")

	const authenticateState = usePromiseState()

	const submit = () => {
		authenticateState.setPromise(login({ account, password }))
	}

	const canSubmit =
		account !== "" && password !== "" && !authenticateState.isLoading

	const isFormDisabled = authenticateState.isLoading

	return (
		<form
			className="flex flex-col items-start p-4 space-y-4"
			onSubmit={preventDefault(submit)}
		>
			<FormField labelText="Username">
				<input
					className={input}
					type="text"
					placeholder="awesome username"
					autoComplete="username"
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
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={isFormDisabled}
				/>
			</FormField>

			<Button className={solidButton} type="submit" disabled={!canSubmit}>
				Log in
			</Button>

			{authenticateState.error && (
				<p className="max-w-xs">{authenticateState.error.message}</p>
			)}
		</form>
	)
}
