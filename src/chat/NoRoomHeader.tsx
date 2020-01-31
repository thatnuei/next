import React from "react"
import {
  alignItems,
  displayNone,
  flex,
  h,
  media,
  ml,
  opacity,
  px,
} from "../ui/helpers.new"
import HeaderMenuButton from "./HeaderMenuButton"

function NoRoomHeader() {
  return (
    <div css={[flex(), alignItems("center"), h(12), px(3)]}>
      <HeaderMenuButton css={[media.lg(displayNone), ml(-3)]} />
      <h1 css={[opacity(75)]}>next</h1>
    </div>
  )
}

export default NoRoomHeader
