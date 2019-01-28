import React from "react"
import Button from "../ui/Button"
import { flexGrow } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css } from "../ui/styled"
import { Channel } from "./types"

export default function ChannelHeader({ channel }: { channel: Channel }) {
  return (
    <>
      <h2 css={[flexGrow, channelNameStyle]}>{channel.name}</h2>
      <Button flat>
        <Icon icon="users" />
      </Button>
    </>
  )
}

const channelNameStyle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
