import { atom, useAtom } from "jotai"
import * as React from "react"
import { useState } from "react"
import { useCharacter } from "../character/state"
import type { CharacterStatus } from "../character/types"
import Button from "../dom/Button"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import { useIdentity } from "./identityContext"

const isSubmittingAtom = atom(false)

function StatusUpdateForm({ onSuccess }: { onSuccess: () => void }) {
	const character = useCharacter(useIdentity())
	const [status, setStatus] = useState(character.status)
	const [statusMessage, setStatusMessage] = useState(character.statusMessage)
	const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom)
	const { send } = useSocketActions()
	const identity = useIdentity()

	useSocketListener((command) => {
		if (command.type === "STA" && command.params.character === identity) {
			onSuccess()
		}
	})

	const submit = (e?: React.SyntheticEvent) => {
		e?.preventDefault()

		if (isSubmitting) return

		// submission has a timeout
		setIsSubmitting(true)
		setTimeout(() => {
			setIsSubmitting(false)
		}, 7000)

		send({
			type: "STA",
			params: { status, statusmsg: statusMessage },
		})
	}

	return (
		<form className={`grid content-start h-full gap-3 p-3`} onSubmit={submit}>
			<FormField labelText="Status">
				<select
					className={select}
					value={status}
					onChange={(e) => setStatus(e.target.value as CharacterStatus)}
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
					value={statusMessage}
					placeholder="Hey! How's it goin'?"
					onChange={(e) => setStatusMessage(e.target.value)}
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