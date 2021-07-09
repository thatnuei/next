import { Portal } from "@headlessui/react"
import NotificationCard from "./NotificationCard"
import NotificationToast from "./NotificationToast"
import { useNotificationActions, useNotificationToastList } from "./state"

export default function NotificationToastOverlay() {
	const toasts = useNotificationToastList()
	const actions = useNotificationActions()

	return (
		<Portal>
			<ul className="fixed inset-0 z-10 flex flex-col items-end justify-end gap-4 p-4 pointer-events-none">
				{toasts.map((toast) => (
					<li key={toast.id} className="pointer-events-auto">
						<NotificationToast
							onDismissed={() => actions.removeToast(toast.id)}
						>
							<NotificationCard notification={toast.notification} />
						</NotificationToast>
					</li>
				))}
			</ul>
		</Portal>
	)
}
