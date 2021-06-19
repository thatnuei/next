import { useObservable } from "micro-observables"
import BBC from "../bbc/BBC"
import { TagProps } from "../jsx/types"
import { statusColors } from "./colors"
import { useCharacter } from "./helpers"

type Props = TagProps<"p"> & {
	name: string
}

function CharacterStatusText({ name, className = "", ...props }: Props) {
	const character = useCharacter(name)
	const status = useObservable(character.status)

	return (
		<p className={`${`text-sm`} ${className}`} {...props}>
			<span
				className={status.type === "crown" ? "rainbow-animation" : ""}
				style={{ color: statusColors[status.type] }}
			>
				{status.type === "crown" ? "awesome" : status.type}
			</span>
			{status.text ? <BBC text={` - ${status.text}`} /> : undefined}
		</p>
	)
}

export default CharacterStatusText
