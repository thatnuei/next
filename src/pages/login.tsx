import Router from "next/router"
import { useState } from "react"
import { useMutation } from "react-query"
import { useCharacterListQuery } from "../modules/auth/character-list"
import { flistFetch } from "../modules/flist"
import { storedUserSession } from "../modules/user"

type LoginData = {
	ticket: string
	characters: string[]
}

export default function Login() {
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")

	const characterListQuery = useCharacterListQuery({
		enabled: false,
	})

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

		await storedUserSession.set({ account, ticket })
		characterListQuery.setData({ characters })
		Router.push("/character-select")
	})

	return (
		<main className="p-4">
			<form
				onSubmit={(e) => {
					e.preventDefault()
					login()
				}}
			>
				<label>
					<div>Username</div>
					<input
						className="border"
						value={account}
						onChange={(e) => setAccount(e.target.value)}
						disabled={loginMutation.isLoading}
					/>
				</label>
				<label>
					<div>Password</div>
					<input
						className="border"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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
