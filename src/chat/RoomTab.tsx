import clsx from "clsx"
import * as React from "react"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import { close } from "../ui/icons"

export type RoomTabProps = {
  title: string
  icon: React.ReactNode
  isActive: boolean
  isUnread: boolean
  onClick: () => void
  onClose: () => void
}

function RoomTab(props: RoomTabProps) {
  const inactiveHoverReveal = `opacity-50 hover:opacity-100`

  const unreadHighlight = `bg-green-500 bg-opacity-20`

  const activeStateStyle = (() => {
    if (props.isActive) return `bg-midnight-0`
    if (props.isUnread) return clsx(inactiveHoverReveal, unreadHighlight)
    return inactiveHoverReveal
  })()

  return (
    <div
      className={clsx(
        `flex flex-row items-center transition min-w-0`,
        activeStateStyle,
      )}
    >
      <Button
        className="flex flex-row items-center flex-1 p-2"
        onClick={props.onClick}
        role="link"
      >
        {props.icon}
        <div
          className="flex-1 ml-2 line-clamp-1"
          dangerouslySetInnerHTML={{ __html: props.title }}
        />
      </Button>
      <Button
        className={`${fadedButton} p-2`}
        title="Close"
        onClick={props.onClose}
      >
        <Icon which={close} />
      </Button>
    </div>
  )
}

export default RoomTab
