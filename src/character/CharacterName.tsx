import { useObservable } from "micro-observables"
import { memo } from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import CharacterMenuTarget from "./CharacterMenuTarget"
import { genderColors, statusColors } from "./colors"
import { useCharacter } from "./helpers"

type Props = TagProps<"span"> & {
	name: string
}

function CharacterName({ name, ...props }: Props) {
	const character = useCharacter(name)
	const gender = useObservable(character.gender)
	const status = useObservable(character.status)

	const statusDotStyle = [
		tw`inline-block mr-1 transform scale-150`,
		{ color: statusColors[status.type] },
		status.type === "crown" && rainbowAnimation,
	]

	return (
		<CharacterMenuTarget name={name} css={tw`font-weight-bold`} {...props}>
			<span css={statusDotStyle}>•</span>
			<span css={{ color: genderColors[gender] }}>{name}</span>
		</CharacterMenuTarget>
	)
}

export default memo(CharacterName)
