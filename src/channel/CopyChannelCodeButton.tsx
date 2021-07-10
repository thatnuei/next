import type { Ref } from ".pnpm/@types+react@17.0.14/node_modules/@types/react"
import { useIsPublicChannel } from "../channelBrowser/state"
import Button from "../dom/Button"
import { useNotificationActions } from "../notifications/state"
import { autoRef } from "../react/autoRef"
import { useChannel } from "./state"

export default autoRef(function CopyChannelCodeButton({
	channelId,
	className,
	onClick,
	ref,
}: {
	channelId: string
	className?: string
	onClick?: () => void
	ref: Ref<HTMLButtonElement>
}) {
	const channel = useChannel(channelId)
	const isPublic = useIsPublicChannel(channelId)
	const { addNotification } = useNotificationActions()

	return (
		<Button
			title="Copy channel code"
			className={className}
			ref={ref}
			onClick={() => {
				const linkCode = isPublic
					? `[channel]${channelId}[/channel]`
					: `[session=${channelId}]${channel.title}[/session]`

				window.navigator.clipboard
					.writeText(linkCode)
					.then(() => {
						addNotification({
							type: "info",
							message: "Copied code to clipboard!",
							save: false,
							showToast: true,
							toastDuration: 3000,
							incrementUnread: false,
						})
					})
					.catch(() => {
						addNotification({
							type: "error",
							message:
								"Copy to clipboard failed. Check your browser settings and make sure clipboard permissions are enabled.",
							save: false,
							showToast: true,
							toastDuration: 6000,
							incrementUnread: false,
						})
					})

				onClick?.()
			}}
		>
			Copy channel code
		</Button>
	)
})
