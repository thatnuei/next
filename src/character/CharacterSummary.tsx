import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"
import { useCharacter } from "./state"

function CharacterSummary({
	name,
	className,
}: {
	name: string
	className?: string
}) {
	const character = useCharacter(name)
	return (
		<div className={className}>
			<ExternalLink
				href={getProfileUrl(character.name)}
				className={`${headerText2} leading-none`}
				style={{ color: genderColors[character.gender] }}
			>
				{character.name}
			</ExternalLink>

			<ExternalLink href={getProfileUrl(character.name)}>
				<Avatar name={character.name} className="my-3" />
			</ExternalLink>

			<div
				className={`px-3 py-2 overflow-y-auto bg-midnight-1`}
				style={{ maxHeight: 300 }}
			>
				<CharacterStatusText name={name} />
			</div>
		</div>
	)
}

export default CharacterSummary
