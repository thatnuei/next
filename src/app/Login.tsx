import { useState } from "react"
import { useMutation } from "react-query"
import { flistFetch } from "../flist/helpers"

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
		<main className="p-4">
			<form
				onSubmit={e => {
					e.preventDefault()
					login()
				}}
			>
				<label>
					<div>Username</div>
					<input
						className="border"
						value={account}
						onChange={e => setAccount(e.target.value)}
						disabled={loginMutation.isLoading}
					/>
				</label>
				<label>
					<div>Password</div>
					<input
						className="border"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						disabled={loginMutation.isLoading}
					/>
				</label>
				<div>
					<button type="submit" disabled={loginMutation.isLoading}>
						Submit
					</button>
				</div>
			</form>

			{loginMutation.isLoading ? (
				<p>Logging in...</p>
			) : loginMutation.error ? (
				<p className="text-red-600">{String(loginMutation.error)}</p>
			) : null}
		</main>
	)
}
