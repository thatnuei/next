import { observer } from "mobx-react-lite"
import BBC from "../bbc/BBC"
import { statusColors } from "./colors"
import { useCharacter } from "./state"

function CharacterStatusText({ name }: { name: string }) {
	const character = useCharacter(name)
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

export default observer(CharacterStatusText)
