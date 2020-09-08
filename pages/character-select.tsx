import Link from "next/link"
import { useState } from "react"
import { QueryStatus } from "react-query"
import { useCharacterListQuery } from "../modules/auth/queries"

export default function CharacterSelect() {
	const [character, setCharacter] = useState("")

	const query = useCharacterListQuery({
		onSuccess: (data) => setCharacter(data.characters[0]),
	})

	if (query.status === QueryStatus.Loading) {
		return <p>Loading...</p>
	}

	if (query.status === QueryStatus.Error) {
		return (
			<>
				<p className="text-red-600">{String(query.error)}</p>
				<Link href="/login">
					<a>Return to login</a>
				</Link>
			</>
		)
	}

	if (query.status === QueryStatus.Success) {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault()
				}}
			>
				<select
					value={character}
					onChange={(e) => setCharacter(e.target.value)}
				>
					{query.data?.characters.map((name) => (
						<option value={name}>{name}</option>
					))}
				</select>
				<button type="submit">Enter chat</button>
			</form>
		)
	}
}
