import { Portal } from "@headlessui/react"
import { useChatContext } from "../chat/ChatContext"
import { useStoreValue } from "../state/store"
import NotificationCard from "./NotificationCard"
import NotificationToast from "./NotificationToast"

export default function NotificationToastOverlay() {
  const context = useChatContext()
  const toasts = useStoreValue(context.notificationStore.toasts)

  return (
    <Portal>
      <ul className="fixed inset-0 z-10 flex flex-col items-end justify-end gap-4 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <li key={toast.id} className="pointer-events-auto">
            <NotificationToast
              duration={toast.duration}
              onDismissed={() =>
                context.notificationStore.removeToast(toast.id)
              }
            >
              <NotificationCard details={toast.details} />
            </NotificationToast>
          </li>
        ))}
      </ul>
    </Portal>
  )
}
