import React, { useState } from "react"
import { useMutation } from "react-query"
import { flistFetch } from "../flist/helpers"
import { useToastStoreActions } from "../toast/context"
import Button from "../ui/Button"
import Label from "../ui/Label"
import TextInput from "../ui/TextInput"

type Props = {
	onSuccess: (data: LoginData) => void | Promise<void>
}

export type LoginData = {
	account: string
	ticket: string
	characters: string[]
}

export default function Login(props: Props) {
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")
	const { show } = useToastStoreActions()

	const [login, loginMutation] = useMutation(
		async () => {
			const { ticket, characters } = await flistFetch<LoginData>(
				`/json/getApiTicket.php`,
				{
					account,
					password,
					no_friends: "true",
					no_bookmarks: "true",
				},
			)

			await props.onSuccess({ account, ticket, characters })
		},
		{
			onError: (error) => {
				show(String(error))
			},
		},
	)

	return (
		<div className="island-container">
			<main className="island-panel">
				<h1 className="island-panel-header">Login</h1>

				<form
					className="flex flex-col items-start p-4 space-y-4"
					onSubmit={(e) => {
						e.preventDefault()
						login()
					}}
				>
					<Label text="Username">
						<TextInput
							className="input-solid"
							placeholder="awesome_username"
							value={account}
							onChangeText={setAccount}
							disabled={loginMutation.isLoading}
						/>
					</Label>

					<Label text="Password">
						<TextInput
							className="input-solid"
							type="password"
							placeholder="••••••••"
							value={password}
							onChangeText={setPassword}
							disabled={loginMutation.isLoading}
						/>
					</Label>

					<Button
						type="submit"
						className="button-solid"
						disabled={loginMutation.isLoading || !account || !password}
					>
						Submit
					</Button>
				</form>
			</main>
		</div>
	)
}
