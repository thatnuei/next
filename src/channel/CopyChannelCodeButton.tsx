import type { Ref } from "react"
import { useGetChannelLink } from "../channelBrowser/state"
import Button from "../dom/Button"
import { useNotificationActions } from "../notifications/state"
import { autoRef } from "../react/autoRef"

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
	const { addNotification } = useNotificationActions()
	const getChannelLink = useGetChannelLink()

	return (
		<Button
			title="Copy channel code"
			className={className}
			ref={ref}
			onClick={() => {
				window.navigator.clipboard
					.writeText(getChannelLink(channelId))
					.then(() => {
						addNotification({
							type: "info",
							message: "Copied code to clipboard!",
							save: false,
							showToast: true,
							toastDuration: 3000,
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
						})
					})

				onClick?.()
			}}
		>
			Copy channel code
		</Button>
	)
})
