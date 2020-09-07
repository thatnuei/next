import { useState } from "react"
import { authenticate } from "../flist"
import { Session } from "./types"

type Props = {
	onSuccess: (session: Session) => void
}

export default function Login(props: Props) {
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string>()

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault()

		authenticate({ account, password })
			.then(({ ticket, characters }) =>
				props.onSuccess({ account, ticket, characters }),
			)
			.catch((error) => setError(String(error)))
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
