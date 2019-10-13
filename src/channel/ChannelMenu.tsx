import { observer } from "mobx-react-lite"
import React from "react"
import { styled } from "../ui/styled"
import ChannelModel from "./ChannelModel"
import ChannelUserList from "./ChannelUserList"

type Props = { channel: ChannelModel }

function ChannelMenu(props: Props) {
  return (
    <Container>
      <ChannelUserList channel={props.channel} />
    </Container>
  )
}

export default observer(ChannelMenu)

const Container = styled.div`
  width: 200px;
  height: 100%;
`
