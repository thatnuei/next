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
  ml,
  opacity,
  p,
  themeBgColor,
  w,
} from "../ui/style"
import { emerald } from "../ui/theme"

type Props = {
  title: string
  icon: React.ReactNode
  state: "inactive" | "active" | "unread"
  onClick?: () => void
}

function RoomTab(props: Props) {
  const activeStateStyle =
    props.state === "inactive"
      ? opacity(0.5)
      : props.state === "active"
      ? themeBgColor(0)
      : props.state === "unread"
      ? [opacity(0.5), { backgroundColor: transparentize(0.8, emerald) }]
      : undefined

  return (
    <div css={[flexRow, alignItems("center"), activeStateStyle, ellipsize]}>
      <Button css={[flex1, flexRow, alignItems("center"), p(2), ellipsize]}>
        <div css={[w(6)]}>{props.icon}</div>
        <div
          css={[ml(2), flex1, ellipsize]}
          dangerouslySetInnerHTML={{ __html: props.title }}
        />
      </Button>
      <Button css={[fadedButton, p(2)]}>
        <Icon name="close" />
      </Button>
    </div>
  )
}

export default RoomTab
