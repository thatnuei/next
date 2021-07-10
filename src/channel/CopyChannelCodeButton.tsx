import { useIsPublicChannel } from "../channelBrowser/state"
import Button from "../dom/Button"
import { useNotificationActions } from "../notifications/state"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useChannel } from "./state"

export default function CopyChannelCodeButton({
	channelId,
}: {
	channelId: string
}) {
	const channel = useChannel(channelId)
	const isPublic = useIsPublicChannel(channelId)
	const { addNotification } = useNotificationActions()

	return (
		<Button
			title="Copy channel code"
			className={fadedButton}
			onClick={() => {
				window.navigator.clipboard
					.writeText(
						isPublic
							? `[channel]${channelId}[/channel]`
							: `[session=${channelId}]${channel.title}[/session]`,
					)
					.then(
						() => {
							addNotification({
								type: "info",
								message: "Copied code to clipboard!",
								showToast: true,
								save: false,
								toastDuration: 3000,
							})
						},
						() => {
							addNotification({
								type: "error",
								message:
									"Copy to clipboard failed. Check your browser settings and make sure clipboard settings are allowed.",
								showToast: true,
								save: false,
								toastDuration: 5000,
							})
						},
					)
			}}
		>
			<Icon which={icons.code} />
		</Button>
	)
}
