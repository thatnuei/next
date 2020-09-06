import { useState } from "react"
import { flistFetch } from "../modules/flist"

export default function Index() {
	const [account, setAccount] = useState("")
	const [password, setPassword] = useState("")

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault()

		flistFetch(`/json/getApiTicket.php`, { account, password })
			.then(console.log)
			.catch(console.error)
	}

	return (
		<main>
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
