import React from "react"
import HeaderMenuButton from "../chat/HeaderMenuButton"
import { fadedButton } from "../ui/components"
import Icon from "../ui/components/Icon"
import {
  alignItems,
  bgMidnight,
  displayNone,
  flex,
  flex1,
  fontCondensed,
  media,
  ml,
  mr,
  py,
  textSize,
  weightLight,
} from "../ui/helpers.new"

type Props = {
  title: string
  right?: React.ReactNode
  onShowDescription: () => void
}

function ChannelHeader(props: Props) {
  return (
    <div css={[bgMidnight(700), flex("row"), alignItems("center"), py(3)]}>
      <HeaderMenuButton css={media.lg(displayNone)} />

      <div css={[flex1, flex("column"), media.lg(ml(3))]}>
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

      {props.right}
    </div>
  )
}

export default ChannelHeader
