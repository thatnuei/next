import { css } from "@emotion/react"
import { transparentize } from "polished"
import React from "react"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import { close } from "../ui/icons"
import {
  alignItems,
  ellipsize,
  flex1,
  flexRow,
  hover,
  ml,
  opacity,
  p,
  themeBgColor,
  transition,
  w,
} from "../ui/style"
import { emerald } from "../ui/theme"

type Props = {
  title: string
  icon: React.ReactNode
  state: "inactive" | "active" | "unread"
  onClick: () => void
}

const inactiveHoverReveal = [opacity(0.5), hover(opacity(0.75))]

const unreadHighlight = css({
  backgroundColor: transparentize(0.8, emerald),
})

function RoomTab(props: Props) {
  const activeStateStyle = {
    inactive: inactiveHoverReveal,
    active: themeBgColor(0),
    unread: [inactiveHoverReveal, unreadHighlight],
  }[props.state]

  return (
    <div>
      <Button onClick={props.onClick} role="link">
        <div>{props.icon}</div>
        <div dangerouslySetInnerHTML={{ __html: props.title }} />
      </Button>
      <Button>
        <Icon which={close} size={2.5} />
      </Button>
    </div>
  );
}

export default RoomTab
