import clsx from "clsx"
import { useObservable } from "micro-observables"
import { memo } from "react"
import CharacterMenuTarget from "./CharacterMenuTarget"
import { genderColors, statusColors } from "./colors"
import { useCharacter } from "./helpers"

type Props = {
	name: string
}

function CharacterName({ name }: Props) {
	const character = useCharacter(name)
	const gender = useObservable(character.gender)
	const status = useObservable(character.status)

	return (
		<CharacterMenuTarget name={name}>
			<span
				className={clsx(
					`inline-block mr-1 transform scale-150`,
					status.type === "crown" && "rainbow-animation",
				)}
				style={{ color: statusColors[status.type] }}
			>
				•
			</span>
			<span className="font-medium" style={{ color: genderColors[gender] }}>
				{name}
			</span>
		</CharacterMenuTarget>
	)
}

export default memo(CharacterName)
