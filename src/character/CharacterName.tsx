import clsx from "clsx"
import { memo } from "react"
import CharacterMenuTarget from "./CharacterMenuTarget"
import { genderColors, statusColors } from "./colors"
import { useNickname } from "./nicknames"
import { useCharacter } from "./state"

interface Props {
	name: string
	statusDot?: "visible" | "hidden"
}

function CharacterName({ name, statusDot = "visible" }: Props) {
	const { gender, status } = useCharacter(name)
	const nickname = useNickname(name)

	return (
		<CharacterMenuTarget name={name}>
			{statusDot === "visible" && (
				<span
					className={clsx(
						`inline-block mr-1 transform scale-150`,
						status === "crown" && "rainbow-animation",
					)}
					style={{ color: statusColors[status] }}
				>
					•
				</span>
			)}
			<span className="font-medium" style={{ color: genderColors[gender] }}>
				{nickname || name}
			</span>
		</CharacterMenuTarget>
	)
}

export default memo(CharacterName)
