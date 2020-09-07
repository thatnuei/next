import { useState } from "react"

type Props = {
	initialCharacter: string
	characters: string[]
	onSubmit: (character: string) => void
}

export default function CharacterSelect(props: Props) {
	const [character, setCharacter] = useState(props.initialCharacter)

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				props.onSubmit(character)
			}}
		>
			<select value={character} onChange={(e) => setCharacter(e.target.value)}>
				{props.characters.map((name) => (
					<option value={name}>{name}</option>
				))}
			</select>
			<button type="submit">Enter chat</button>
		</form>
	)
}
