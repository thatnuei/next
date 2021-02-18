import { useObservable } from "micro-observables"
import { memo } from "react"
import { apply, tw } from "twind"
import { css } from "twind/css"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import CharacterMenuTarget from "./CharacterMenuTarget"
import { genderColors, statusColors } from "./colors"
import { useCharacter } from "./helpers"

type Props = TagProps<"span"> & {
	name: string
}

function CharacterName({ name, className = "", ...props }: Props) {
	const character = useCharacter(name)
	const gender = useObservable(character.gender)
	const status = useObservable(character.status)

	const statusDotStyle = tw(
		`inline-block mr-1 transform scale-150`,
		css({ color: statusColors[status.type] }),
		status.type === "crown" && rainbowAnimation,
	)

	return (
		<CharacterMenuTarget
			name={name}
			className={`${tw(apply`font-medium`)} ${className}`}
			{...props}
		>
			<span className={statusDotStyle}>•</span>
			<span style={{ color: genderColors[gender] }}>{name}</span>
		</CharacterMenuTarget>
	)
}

export default memo(CharacterName)
