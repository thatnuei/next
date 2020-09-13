import { useState } from "react"
import { compare } from "../helpers/compare"

type Props = {
	characters: string[]
	initialCharacter: string
	onChange: (character: string) => void
	onSubmit: (character: string) => void
	onBack: () => void
}

export default function CharacterSelect(props: Props) {
	const [character, setCharacter] = useState(props.initialCharacter)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		props.onSubmit(character)
	}

	return (
		<form onSubmit={handleSubmit}>
			<h1>Choose your identity</h1>

			<select
				value={character}
				onChange={e => {
					setCharacter(e.target.value)
					props.onChange(e.target.value)
				}}
			>
				{props.characters
					.slice()
					.sort(compare(name => name.toLowerCase()))
					.map(name => (
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
