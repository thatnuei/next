import { useObservable } from "micro-observables"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { TagProps } from "../jsx/types"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"
import { useCharacter } from "./helpers"

type Props = TagProps<"div"> & { name: string }

function CharacterSummary({ name, ...props }: Props) {
	const char = useCharacter(name)
	const gender = useObservable(char.gender)

	return (
		<div {...props}>
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
