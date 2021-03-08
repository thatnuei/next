import { useObservable } from "micro-observables"
import { tw } from "twind"
import { css } from "twind/css"
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
				tw={`${headerText2} ${css({
					color: genderColors[gender],
				})} leading-none`}
			>
				{name}
			</ExternalLink>

			<ExternalLink href={getProfileUrl(name)}>
				<Avatar name={name} tw="my-3" />
			</ExternalLink>

			<div
				tw={`px-3 py-2 overflow-y-auto bg-midnight-1 ${css({
					maxHeight: tw.theme("spacing.28"),
				})}`}
			>
				<CharacterStatusText name={name} />
			</div>
		</div>
	)
}

export default CharacterSummary
