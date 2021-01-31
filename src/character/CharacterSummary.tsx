import { useObservable } from "micro-observables"
import tw from "twin.macro"
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
	const genderColor = { color: genderColors[gender] }

	return (
		<div {...props}>
			<ExternalLink
				href={getProfileUrl(name)}
				css={[headerText2, genderColor, tw`leading-none`]}
			>
				{name}
			</ExternalLink>

			<ExternalLink href={getProfileUrl(name)}>
				<Avatar name={name} css={tw`my-3`} />
			</ExternalLink>

			<CharacterStatusText
				name={name}
				css={[
					tw`px-3 py-2 overflow-y-auto bg-background-1`,
					{ maxHeight: 100 }, // some statuses can get really big
				]}
			/>
		</div>
	)
}

export default CharacterSummary
