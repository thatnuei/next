import type { Character } from "../chat/state"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"

function CharacterSummary({
	character,
	className,
}: {
	character: Character
	className?: string
}) {
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
				<CharacterStatusText character={character} />
			</div>
		</div>
	)
}

export default CharacterSummary
