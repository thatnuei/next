import Link from "next/link"
import Router from "next/router"
import { useState } from "react"
import { useCharacterListQuery } from "../modules/auth/character-list"
import { storedIdentity } from "../modules/auth/stored-identity"
import { compare } from "../modules/helpers/compare"
import { storedUserSession } from "../modules/user"

export default function CharacterSelect() {
	const query = useCharacterListQuery()

	if (query.isLoading) {
		return <p>Loading...</p>
	}

	if (query.error) {
		return (
			<>
				<p className="text-red-600">{String(query.error)}</p>
				<Link href="/login">
					<a>Return to login</a>
				</Link>
			</>
		)
	}

	if (query.data) {
		return (
			<CharacterSelectForm
				characters={query.data.characters}
				initialCharacter={query.data.characters[0]}
			/>
		)
	}
}

function CharacterSelectForm(props: {
	characters: string[]
	initialCharacter: string
}) {
	const [character, setCharacter] = useState(props.initialCharacter)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const session = await storedUserSession.get()
		if (!session) return

		await storedIdentity(session.account).set(character)

		Router.push(`/chat`)
	}

	return (
		<form onSubmit={handleSubmit}>
			<select value={character} onChange={(e) => setCharacter(e.target.value)}>
				{props.characters
					.slice()
					.sort(compare((name) => name.toLowerCase()))
					.map((name) => (
						<option key={name} value={name}>
							{name}
						</option>
					))}
			</select>
			<button type="submit">Enter chat</button>
			<Link href="/login">
				<a>Return to login</a>
			</Link>
		</form>
	)
}
