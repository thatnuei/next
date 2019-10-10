import React from "react"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  return <ChannelHeader channel={channel} />
}

export default ChannelView
