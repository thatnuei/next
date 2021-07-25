import usePromiseState from "../state/usePromiseState"
import { solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import LoadingIcon from "../ui/LoadingIcon"

export default function SettingsScreen() {
	const state = usePromiseState(window.Notification.permission)

	const requestNotifications = () => {
		state.setPromise(window.Notification.requestPermission())
	}

	return (
		<div>
			<FormField labelText="Enable notifications">
				{state.status === "pending" ? (
					<LoadingIcon />
				) : state.value === "default" ? (
					<button className={solidButton} onClick={requestNotifications}>
						Click to enable system notifications
					</button>
				) : state.value === "denied" ? (
					<p>
						Notifications have been blocked. Check your browser settings to
						allow or disallow them again.
					</p>
				) : state.value === "granted" ? (
					<p>Notifications are enabled!</p>
				) : state.status === "rejected" ? (
					<p>Failed to fetch notification permissions: {state.error.message}</p>
				) : (
					<LoadingIcon />
				)}
			</FormField>

			<p className="font-condensed mt-8 text-center text-lg opacity-75 italic">
				More settings coming later!
			</p>
		</div>
	)
}
