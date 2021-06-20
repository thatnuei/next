import clsx from "clsx"
import { useState } from "react"
import { safeJsonParse } from "../common/json"
import Button from "../dom/Button"
import ExternalLink from "../dom/ExternalLink"
import { useWindowEvent } from "../dom/useWindowEvent"
import { useRootStore } from "../root/context"
import type { ServerCommand } from "../socket/helpers"
import { input, solidButton } from "../ui/components"
import Drawer from "../ui/Drawer"
import FormField from "../ui/FormField"

export default function DevTools() {
	const [visible, setVisible] = useState(false)
	const toggleVisible = () => setVisible((v) => !v)

	useWindowEvent("keypress", (event) => {
		if (event.code === "Backquote" && event.shiftKey) {
			event.preventDefault()
			toggleVisible()
		}
	})

	return (
		<Drawer side="bottom" open={visible} onOpenChange={setVisible}>
			<div className="w-full p-4">
				<CommandSimulator />
			</div>
		</Drawer>
	)
}

function CommandSimulator() {
	const root = useRootStore()

	const defaultCommand = "MSG"
	const defaultParams =
		'{"character":"Testificate","message":"test message","channel":"Development"}'

	const [commandState, setCommand] = useState("")
	const command = commandState || defaultCommand

	const [paramsState, setParams] = useState("")
	const params = paramsState || defaultParams

	const paramsParseResult =
		params.length > 2 ? safeJsonParse(params) : undefined

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (paramsParseResult?.result) {
			root.socket.commands.publish({
				type: command,
				params: paramsParseResult.result,
			} as ServerCommand)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="grid gap-3">
			<div className="grid gap-1">
				<h2>Command Simulator</h2>
				<p className="text-sm">
					Simulate a fake socket command just within the client. Does not send
					any socket messages. This can crash the app if you&apos;re not
					careful!
				</p>
				<p className="text-sm">
					See the{" "}
					<ExternalLink
						href="https://wiki.f-list.net/F-Chat_Server_Commands"
						className="underline"
					>
						wiki
					</ExternalLink>{" "}
					for a list of server commands.
				</p>
			</div>
			<FormField labelText="Command">
				<input
					className={input}
					placeholder="MSG"
					value={commandState}
					onChange={(e) => setCommand(e.target.value)}
				/>
			</FormField>
			<FormField labelText="Params">
				<textarea
					rows={3}
					className={clsx(input, "font-mono resize-y")}
					placeholder='{"character":"Testificate","message":"test message","channel":"Development"}'
					value={paramsState}
					onChange={(e) => setParams(e.target.value)}
				/>
			</FormField>
			<pre className="overflow-x-auto">{paramsParseResult?.error?.message}</pre>
			<div>
				<Button type="submit" className={solidButton}>
					Submit
				</Button>
			</div>
		</form>
	)
}
