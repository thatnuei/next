import Link from "next/link"
import Router from "next/router"
import { useState } from "react"
import { useCharacterListQuery } from "../modules/auth/character-list"
import { compare } from "../modules/helpers/compare"

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

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				Router.push(`/chat?identity=${character}`)
			}}
		>
			<select value={character} onChange={(e) => setCharacter(e.target.value)}>
				{[...props.characters]
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
