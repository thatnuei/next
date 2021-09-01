import type { Ref } from "react"
import { useChatContext } from "../chat/ChatContext"
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
  ref?: Ref<HTMLButtonElement>
}) {
  const context = useChatContext()
  const { addNotification } = useNotificationActions()

  return (
    <Button
      title="Copy channel code"
      className={className}
      ref={ref}
      onClick={async () => {
        onClick?.()

        const link =
          context.channelBrowserStore.selectChannelLink(channelId).value

        try {
          await window.navigator.clipboard.writeText(link)

          addNotification({
            type: "info",
            message: "Copied code to clipboard!",
            save: false,
            showToast: true,
            toastDuration: 3000,
          })
        } catch (e) {
          addNotification({
            type: "error",
            message:
              "Copy to clipboard failed. Check your browser settings and make sure clipboard permissions are enabled.",
            save: false,
            showToast: true,
            toastDuration: 6000,
          })
        }
      }}
    >
      Copy channel code
    </Button>
  )
})
