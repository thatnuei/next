import { useState } from "react"
import Avatar from "../character/Avatar"
import { compareLower } from "../common/compareLower"
import Button from "../dom/Button"
import { preventDefault } from "../react/preventDefault"
import { anchor, select, solidButton } from "../ui/components"

function CharacterSelect({
	characters,
	onSubmit,
	onReturnToLogin,
}: {
	characters: string[]
	onSubmit: (identity: string) => void
	onReturnToLogin: () => void
}) {
	const [identity, setIdentity] = useState<string>(characters[0])

	return (
		<form
			className="flex flex-col items-center p-4 space-y-4"
			onSubmit={preventDefault(() => onSubmit(identity))}
		>
			<Avatar name={identity} />
			<select
				className={select}
				value={identity}
				onChange={(e) => setIdentity(e.target.value)}
			>
				{characters.sort(compareLower).map((name) => (
					<option key={name} value={name}>
						{name}
					</option>
				))}
			</select>
			<Button className={solidButton} type="submit">
				Enter chat
			</Button>
			<Button className={anchor} onClick={onReturnToLogin}>
				Return to Login
			</Button>
		</form>
	)
}

export default CharacterSelect
