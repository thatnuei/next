import { useObservable } from "micro-observables"
import * as React from "react"
import { tw } from "twind"
import Avatar from "../character/Avatar"
import Button from "../dom/Button"
import { useRootStore } from "../root/context"
import { anchor, select, solidButton } from "../ui/components"
import { flexColumn } from "../ui/helpers"

function CharacterSelect() {
	const root = useRootStore()
	const { characters, account } = useObservable(root.userStore.userData)
	const identity = useObservable(root.appStore.identity)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		root.appStore.enterChat()
	}

	return (
		<form
			className={tw([flexColumn, tw`items-center p-4`])}
			onSubmit={handleSubmit}
		>
			<Avatar name={identity} />
			<select
				className={tw([select, tw`my-4`])}
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
			<Button
				className={tw([anchor, tw`mt-4`])}
				onClick={root.appStore.showLogin}
			>
				Return to Login
			</Button>
		</form>
	)
}

export default CharacterSelect
