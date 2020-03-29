import { css } from "@emotion/react"
import { transparentize } from "polished"
import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import { transition } from "../ui/helpers"
import Icon from "../ui/Icon"
import { close } from "../ui/icons"
import { emerald } from "../ui/theme.old"

type Props = {
  title: string
  icon: React.ReactNode
  state: "inactive" | "active" | "unread"
  onClick: () => void
}

const inactiveHoverReveal = tw`opacity-50 hover:opacity-75`

const unreadHighlight = css({
  backgroundColor: transparentize(0.8, emerald),
})

const ellipsize = css({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
})

function RoomTab(props: Props) {
  const activeStateStyle = {
    inactive: inactiveHoverReveal,
    active: tw`bg-background-0`,
    unread: [inactiveHoverReveal, unreadHighlight],
  }[props.state]

  return (
    <div css={[tw`flex flex-row items-center`, activeStateStyle, transition]}>
      <Button
        css={[tw`flex flex-row items-center flex-1 p-2`, ellipsize]}
        onClick={props.onClick}
        role="link"
      >
        {props.icon}
        <div
          css={[tw`flex-1 ml-2`, ellipsize]}
          dangerouslySetInnerHTML={{ __html: props.title }}
        />
      </Button>
      <Button css={[fadedButton, tw`p-2`]} title="Close">
        <Icon which={close} css={tw`w-5 h-5`} />
      </Button>
    </div>
  )
}

export default RoomTab
