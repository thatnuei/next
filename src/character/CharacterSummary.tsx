import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"
import { useCharacterGender } from "./state"

function CharacterSummary({
	name,
	className = "",
}: {
	name: string
	className?: string
}) {
	const gender = useCharacterGender(name)
	return (
		<div className={className}>
			<ExternalLink
				href={getProfileUrl(name)}
				className={`${headerText2} leading-none`}
				style={{ color: genderColors[gender] }}
			>
				{name}
			</ExternalLink>

			<ExternalLink href={getProfileUrl(name)}>
				<Avatar name={name} className="my-3" />
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
