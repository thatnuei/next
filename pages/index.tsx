import * as idb from "idb-keyval"
import { useState } from "react"
import { authenticate } from "../modules/flist"

export default function Index() {
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault()

		authenticate({ account, password })
			.then(({ ticket }) => idb.set("session", { account, ticket }))
			.catch(console.error)
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
		</main>
	)
}
