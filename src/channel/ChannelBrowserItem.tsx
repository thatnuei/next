import React from "react"
import Icon from "../ui/Icon"
import { earth } from "../ui/icons"
import {
  alignItems,
  flex1,
  flexRow,
  hover,
  mr,
  opacity,
  px,
  py,
  textRight,
  themeBgColor,
  transition,
  w,
} from "../ui/style"

type Props = {
  name: string
  userCount: number
  isActive: boolean
}

function ChannelBrowserItem(props: Props) {
  const containerStyle = [
    py(2),
    px(2),
    flexRow,
    alignItems("center"),
    props.isActive ? activeStyle : inactiveStyle,
    transition("opacity, background-color"),
  ]

  return (
    <button>
      <Icon which={earth} />
      <div>{props.name}</div>
      <div />
      <div>{props.userCount}</div>
    </button>
  );
}

export default ChannelBrowserItem

const activeStyle = [opacity(1), themeBgColor(0)]
const inactiveStyle = [opacity(0.4), hover(opacity(0.7))]
