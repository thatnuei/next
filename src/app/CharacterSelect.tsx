import { useObservable } from "micro-observables"
import * as React from "react"
import Avatar from "../character/Avatar"
import Button from "../dom/Button"
import { useRootStore } from "../root/context"
import { anchor, select, solidButton } from "../ui/components"

function CharacterSelect() {
	const root = useRootStore()
	const { characters, account } = useObservable(root.userStore.userData)
	const identity = useObservable(root.appStore.identity)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		root.appStore.enterChat()
	}

	return (
		<form className="flex flex-col items-center p-4 space-y-4" onSubmit={handleSubmit}>
			<Avatar name={identity} />
			<select
				className={select}
				value={identity}
				onChange={(e) => root.appStore.setIdentity(e.target.value, account)}
			>
				{characters.map((name) => (
					<option key={name} value={name}>
						{name}
					</option>
				))}
			</select>
			<Button className={solidButton} type="submit">
				Enter chat
			</Button>
			<Button className={anchor} onClick={root.appStore.showLogin}>
				Return to Login
			</Button>
		</form>
	)
}

export default CharacterSelect
