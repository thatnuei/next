import BBC from "../bbc/BBC"
import type { Character } from "../chat/state"
import { statusColors } from "./colors"

function CharacterStatusText({ character }: { character: Character }) {
	return (
		<p className="text-sm">
			<span
				className={character.status === "crown" ? "rainbow-animation" : ""}
				style={{ color: statusColors[character.status] }}
			>
				{character.status === "crown" ? "awesome" : character.status}
			</span>
			{character.statusMessage ? (
				<BBC text={` - ${character.statusMessage}`} />
			) : undefined}
		</p>
	)
}

export default CharacterStatusText
