import { useState } from "react"
import { getAvatarUrl } from "../flist/helpers"
import { compare } from "../helpers/compare"
import Button from "../ui/Button"
import Select from "../ui/Select"

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
		<main className="space-y-4 island-container">
			<div className="flex flex-col items-center island-panel">
				<h1 className="island-panel-header">Choose your identity</h1>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col items-center p-4 space-y-4"
				>
					<img
						src={getAvatarUrl(character)}
						alt=""
						role="presentation"
						className="block w-24 h-24"
					/>

					<Select
						className="max-w-xs select-solid"
						aria-label="Identity"
						value={character}
						onChangeValue={value => {
							setCharacter(value)
							props.onChange(value)
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
					</Select>

					<Button type="submit" className="button-solid">
						Enter chat
					</Button>
				</form>
			</div>

			<Button className="anchor" onClick={props.onBack}>
				Return to login
			</Button>
		</main>
	)
}
