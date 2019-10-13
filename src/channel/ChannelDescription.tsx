import { observer } from "mobx-react-lite"
import React from "react"
import BBC from "../bbc/BBC"
import { fillArea, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import ChannelModel from "./ChannelModel"

type Props = { channel: ChannelModel }

function ChannelDescription(props: Props) {
  return (
    <Description>
      <BBC text={props.channel.description} />
    </Description>
  )
}

export default observer(ChannelDescription)

const Description = styled.div`
  padding: ${spacing.small};
  ${scrollVertical};
  ${fillArea};
`
