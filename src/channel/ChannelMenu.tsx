import React from "react"
import { styled } from "../ui/styled"
import ChannelModel from "./ChannelModel"
import ChannelUserList, { useChannelUserListEntries } from "./ChannelUserList"

type Props = { channel: ChannelModel }

function ChannelMenu({ channel }: Props) {
  const userListEntries = useChannelUserListEntries(channel)
  return (
    <Container>
      <ChannelUserList users={userListEntries} />
    </Container>
  )
}

export default ChannelMenu

const Container = styled.div`
  width: 200px;
  height: 100%;
`
