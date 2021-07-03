import clsx from "clsx"
import { memo } from "react"
import CharacterMenuTarget from "./CharacterMenuTarget"
import { genderColors, statusColors } from "./colors"
import { useCharacter } from "./state"

interface Props {
	name: string
}

function CharacterName({ name }: Props) {
	const { gender, status } = useCharacter(name)

	return (
		<CharacterMenuTarget name={name}>
			<span
				className={clsx(
					`inline-block mr-1 transform scale-150`,
					status === "crown" && "rainbow-animation",
				)}
				style={{ color: statusColors[status] }}
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
