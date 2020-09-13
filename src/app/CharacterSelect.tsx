import { useState } from "react"
import { getAvatarUrl } from "../flist/helpers"
import { compare } from "../helpers/compare"
import { AnchorText } from "../ui/anchor"
import { SolidButton } from "../ui/button"
import { IslandContainer, IslandPanel, IslandPanelHeader } from "../ui/island"
import { Select } from "../ui/select"

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
		<IslandContainer>
			<main className="flex flex-col items-center space-y-4">
				<IslandPanel>
					<IslandPanelHeader>
						<h1>Choose your identity</h1>
					</IslandPanelHeader>

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

						<div className="max-w-xs">
							<Select
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
						</div>

						<SolidButton type="submit">Enter chat</SolidButton>
					</form>
				</IslandPanel>

				<button type="button" onClick={props.onBack}>
					<AnchorText>Return to login</AnchorText>
				</button>
			</main>
		</IslandContainer>
	)
}
