import Router from "next/router"
import { useState } from "react"
import { useCharacterListQuery } from "../modules/auth/character-list"
import { storedUserSession } from "../modules/auth/session"
import { authenticate } from "../modules/flist"

export default function Login() {
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string>()

	const characterListQuery = useCharacterListQuery({
		enabled: false,
	})

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault()

		try {
			const { ticket, characters } = await authenticate({ account, password })
			await storedUserSession.set({ account, ticket })
			characterListQuery.setData({ characters })
			Router.push("/character-select")
		} catch (error) {
			setError(String(error))
		}
	}

	return (
		<main className="p-4">
			<form onSubmit={handleSubmit}>
				<label>
					<div>Username</div>
					<input
						className="border"
						value={account}
						onChange={(e) => setAccount(e.target.value)}
					/>
				</label>
				<label>
					<div>Password</div>
					<input
						className="border"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<div>
					<button type="submit">Submit</button>
				</div>
			</form>
			{error ? <p className="text-red-600">{error}</p> : null}
		</main>
	)
}
