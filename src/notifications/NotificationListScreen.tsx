import clsx from "clsx"
import { useEffect } from "react"
import { useChatContext } from "../chat/ChatContext"
import Button from "../dom/Button"
import { fadedButton, headerText } from "../ui/components"
import Icon from "../ui/Icon"
import { clearMessages } from "../ui/icons"
import { ScreenHeader } from "../ui/ScreenHeader"
import NotificationList from "./NotificationList"

export default function NotificationListScreen() {
  const context = useChatContext()

  useEffect(() => {
    context.notificationStore.markAllReading()
    return () => {
      context.notificationStore.markAllRead()
    }
  }, [context.notificationStore])

  return (
    <div className="flex flex-col h-full gap-1">
      <div className="bg-midnight-0">
        <ScreenHeader>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className={headerText}>Notifications</h1>
            <Button
              className={clsx(fadedButton, "flex gap-1 items-center")}
              onClick={context.notificationStore.clearNotifications}
            >
              <Icon which={clearMessages} />
              <span className="leading-none">Clear notifications</span>
            </Button>
          </div>
        </ScreenHeader>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <NotificationList />
      </div>
    </div>
  )
}
