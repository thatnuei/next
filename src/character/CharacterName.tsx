import { useObservable } from "micro-observables"
import { memo } from "react"
import { tw } from "twind"
import { css } from "twind/css"
import { rainbowAnimation } from "../ui/helpers"
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

	const statusDotStyle = tw(
		`inline-block mr-1 transform scale-150`,
		css({ color: statusColors[status.type] }),
		status.type === "crown" && rainbowAnimation,
	)

	return (
		<CharacterMenuTarget name={name}>
			<span className={statusDotStyle}>•</span>
			<span tw="font-medium" style={{ color: genderColors[gender] }}>
				{name}
			</span>
		</CharacterMenuTarget>
	)
}

export default memo(CharacterName)
