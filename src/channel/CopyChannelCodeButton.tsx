import type { Ref } from "react"
import type { ChannelBrowserStore } from "../channelBrowser/ChannelBrowserStore"
import Button from "../dom/Button"
import { useNotificationActions } from "../notifications/state"
import { autoRef } from "../react/autoRef"

export default autoRef(function CopyChannelCodeButton({
  channelId,
  channelBrowserStore,
  className,
  onClick,
  ref,
}: {
  channelId: string
  channelBrowserStore: ChannelBrowserStore
  className?: string
  onClick?: () => void
  ref?: Ref<HTMLButtonElement>
}) {
  const { addNotification } = useNotificationActions()

  return (
    <Button
      title="Copy channel code"
      className={className}
      ref={ref}
      onClick={() => {
        window.navigator.clipboard
          .writeText(channelBrowserStore.selectChannelLink(channelId).value)
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
