import React from "react"
import { roomSidebarBreakpoint } from "../chat/constants"
import HeaderMenuButton from "../chat/HeaderMenuButton"
import Button from "../dom/components/Button"
import useMedia from "../dom/hooks/useMedia"
import { fadedButton } from "../ui/components"
import Icon from "../ui/components/Icon"
import {
  alignItems,
  bgMidnight,
  flex,
  flex1,
  fontCondensed,
  mr,
  p,
  py,
  textSize,
  weightLight,
} from "../ui/helpers.new"

type Props = {
  title: string
  onShowChannelMenu: () => void
  onShowDescription: () => void
}

function ChannelHeader(props: Props) {
  // TODO: the parent component should be the one to determine this,
  // not this component
  // we should make onShowChannelMenu nullable,
  // then show the menu button if we receive it
  const isChannelMenuHidden = useMedia(
    `(max-width: ${roomSidebarBreakpoint}px)`,
  )

  return (
    <div css={[bgMidnight(700), flex("row"), alignItems("center"), py(3)]}>
      <HeaderMenuButton />

      <div css={[flex1, flex("column")]}>
        <h1 css={[fontCondensed, weightLight, textSize("xl")]}>
          {props.title}
        </h1>
        <button
          css={[fadedButton, flex("row"), alignItems("center")]}
          onClick={props.onShowDescription}
        >
          <span css={mr(1)}>Description</span>
          <Icon name="about" size={0.8} />
        </button>
      </div>

      {isChannelMenuHidden && (
        <Button css={[fadedButton, p(3)]} onClick={props.onShowChannelMenu}>
          <Icon name="more" />
        </Button>
      )}
    </div>
  )
}

export default ChannelHeader
