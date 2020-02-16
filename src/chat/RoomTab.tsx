import { css } from "@emotion/react"
import { transparentize } from "polished"
import React from "react"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
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

const inactiveHoverReveal = [opacity(0.4), hover(opacity(0.7))]

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
    <div
      css={[
        flexRow,
        alignItems("center"),
        activeStateStyle,
        ellipsize,
        transition("opacity, background-color"),
      ]}
    >
      <Button
        css={[flex1, flexRow, alignItems("center"), p(2), ellipsize]}
        onClick={props.onClick}
      >
        <div css={[w(6)]}>{props.icon}</div>
        <div
          css={[ml(2), flex1, ellipsize]}
          dangerouslySetInnerHTML={{ __html: props.title }}
        />
      </Button>
      <Button css={[fadedButton, p(2)]}>
        <Icon name="close" size={2.5} />
      </Button>
    </div>
  )
}

export default RoomTab
