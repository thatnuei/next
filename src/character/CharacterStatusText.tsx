import { useObservable } from "micro-observables"
import { tw } from "twind"
import { css } from "twind/css"
import BBC from "../bbc/BBC"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import { statusColors } from "./colors"
import { useCharacter } from "./helpers"

type Props = TagProps<"p"> & {
	name: string
}

function CharacterStatusText({ name, className = "", ...props }: Props) {
	const character = useCharacter(name)
	const status = useObservable(character.status)

	return (
		<p className={`${tw`text-sm`} ${className}`} {...props}>
			<span
				className={tw(
					css({ color: statusColors[status.type] }),
					status.type === "crown" && rainbowAnimation,
				)}
			>
				{status.type === "crown" ? "awesome" : status.type}
			</span>
			{status.text ? <BBC text={` - ${status.text}`} /> : undefined}
		</p>
	)
}

export default CharacterStatusText
