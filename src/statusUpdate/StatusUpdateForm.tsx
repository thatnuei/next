import { useObservable } from "micro-observables"
import * as React from "react"
import { useState } from "react"
import { useCharacter } from "../character/state"
import type { CharacterStatus } from "../character/types"
import { useIdentity } from "../chat/identityContext"
import Button from "../dom/Button"
import { useRootStore } from "../root/context"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

function StatusUpdateForm() {
	const root = useRootStore()

	const identityCharacter = useCharacter(useIdentity())

	const [status, setStatus] = useState({
		type: identityCharacter.status,
		text: identityCharacter.statusMessage,
	})

	const isSubmitting = useObservable(root.statusUpdateStore.isSubmitting)

	const submit = (e?: React.SyntheticEvent) => {
		e?.preventDefault()
		root.statusUpdateStore.submit(status).catch(console.error)
	}

	return (
		<form className={`grid content-start h-full gap-3 p-3`} onSubmit={submit}>
			<FormField labelText="Status">
				<select
					className={select}
					value={status.type}
					onChange={(e) => {
						const type = e.target.value as CharacterStatus
						setStatus((prev) => ({ ...prev, type }))
					}}
				>
					<option value="online">Online</option>
					<option value="looking">Looking</option>
					<option value="busy">Busy</option>
					<option value="away">Away</option>
					<option value="dnd">Do Not Disturb</option>
				</select>
			</FormField>
			<FormField labelText="Status message (optional)">
				<textarea
					className={`${input} flex-1 block`}
					value={status.text}
					onChange={(e) => {
						const text = e.currentTarget.value
						setStatus((prev) => ({ ...prev, text }))
					}}
					onKeyPress={(event) => {
						if (event.key === "\n" && (event.ctrlKey || event.shiftKey)) {
							submit()
						}
					}}
				/>
			</FormField>
			<Button
				type="submit"
				className={`${solidButton} justify-self-start`}
				disabled={isSubmitting}
			>
				Submit
			</Button>
		</form>
	)
}

export default StatusUpdateForm
