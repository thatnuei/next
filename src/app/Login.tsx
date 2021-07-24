import { useState } from "react"
import Button from "../dom/Button"
import TextInput from "../dom/TextInput"
import { authenticate } from "../flist/authenticate"
import type { AuthUser } from "../flist/types"
import { preventDefault } from "../react/preventDefault"
import usePromiseState from "../state/usePromiseState"
import { input, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

export default function Login({
	onSuccess,
}: {
	onSuccess: (user: AuthUser) => void
}) {
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")
	const state = usePromiseState()
	const canSubmit = account !== "" && password !== "" && !state.isLoading
	const isFormDisabled = state.isLoading

	const submit = () => {
		if (state.isLoading) return
		state.setPromise(authenticate({ account, password }).then(onSuccess))
	}

	return (
		<form
			className="flex flex-col items-start p-4 space-y-4"
			onSubmit={preventDefault(submit)}
		>
			<FormField labelText="Username">
				<TextInput
					className={input}
					type="text"
					placeholder="awesome username"
					autoComplete="username"
					value={account}
					onChangeText={setAccount}
					disabled={isFormDisabled}
				/>
			</FormField>

			<FormField labelText="Password">
				<TextInput
					className={input}
					type="password"
					placeholder="••••••••"
					autoComplete="current-password"
					value={password}
					onChangeText={setPassword}
					disabled={isFormDisabled}
				/>
			</FormField>

			<Button className={solidButton} type="submit" disabled={!canSubmit}>
				Log in
			</Button>

			{state.error && <p className="max-w-xs">{state.error.message}</p>}
		</form>
	)
}
