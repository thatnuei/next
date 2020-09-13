import { useState } from "react"
import { compare } from "../helpers/compare"

type Props = {
	characters: string[]
	onSubmit: (character: string) => void
	onBack: () => void
}

export default function CharacterSelect(props: Props) {
	const characters = props.characters
		.slice()
		.sort(compare(name => name.toLowerCase()))

	const [character, setCharacter] = useState(characters[0])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		props.onSubmit(character)
	}

	return (
		<form onSubmit={handleSubmit}>
			<h1>Choose your identity</h1>
			<select value={character} onChange={e => setCharacter(e.target.value)}>
				{characters.map(name => (
					<option key={name} value={name}>
						{name}
					</option>
				))}
			</select>
			<button type="submit">Enter chat</button>
			<button type="button" onClick={props.onBack}>
				Return to login
			</button>
		</form>
	)
}
