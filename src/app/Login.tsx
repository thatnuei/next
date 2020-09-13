import React, { useState } from "react"
import { useMutation } from "react-query"
import { flistFetch } from "../flist/helpers"
import { SolidButton } from "../ui/button"
import { ErrorText } from "../ui/error-text"
import { TextInput } from "../ui/input"
import { IslandContainer, IslandPanel, IslandPanelHeader } from "../ui/island"
import { Label } from "../ui/label"

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

	const [login, loginMutation] = useMutation(async () => {
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
	})

	return (
		<IslandContainer>
			<IslandPanel>
				<main>
					<IslandPanelHeader>
						<h1>Login</h1>
					</IslandPanelHeader>

					<form
						className="flex flex-col items-start p-4 space-y-4"
						onSubmit={e => {
							e.preventDefault()
							login()
						}}
					>
						<Label text="Username">
							<TextInput
								placeholder="awesome_username"
								value={account}
								onChangeText={setAccount}
								disabled={loginMutation.isLoading}
							/>
						</Label>

						<Label text="Password">
							<TextInput
								type="password"
								placeholder="••••••••"
								value={password}
								onChangeText={setPassword}
								disabled={loginMutation.isLoading}
							/>
						</Label>

						<SolidButton type="submit" disabled={loginMutation.isLoading}>
							Submit
						</SolidButton>

						<div className="max-w-xs">
							{loginMutation.isLoading ? (
								<p>Logging in...</p>
							) : loginMutation.error ? (
								<ErrorText>{String(loginMutation.error)}</ErrorText>
							) : null}
						</div>
					</form>
				</main>
			</IslandPanel>
		</IslandContainer>
	)
}
