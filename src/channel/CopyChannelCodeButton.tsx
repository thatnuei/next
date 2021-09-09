import type { Ref } from "react"
import { useChatContext } from "../chat/ChatContext"
import Button from "../dom/Button"
import { autoRef } from "../react/autoRef"

export default autoRef(function CopyChannelCodeButton({
  channelId,
  className,
  onClick,
  ref,
}: {
  channelId: string
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ref?: Ref<HTMLButtonElement>
}) {
  const context = useChatContext()

  return (
    <Button
      title="Copy channel code"
      className={className}
      ref={ref}
      onClick={async (event) => {
        onClick?.(event)

        const link =
          context.channelBrowserStore.selectChannelLink(channelId).value

        try {
          await window.navigator.clipboard.writeText(link)

          context.notificationStore.addToast({
            details: {
              type: "info",
              message: "Copied code to clipboard!",
            },
            duration: 3000,
          })
        } catch (e) {
          context.notificationStore.addToast({
            details: {
              type: "error",
              message:
                "Copy to clipboard failed. Check your browser settings and make sure clipboard permissions are enabled.",
            },
            duration: 6000,
          })
        }
      }}
    >
      Copy channel code
    </Button>
  )
})
