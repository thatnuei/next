import React from "react"
import { styled } from "../ui/styled"
import ChannelUserList, { ChannelUserListEntry } from "./ChannelUserList"

type Props = { users: ChannelUserListEntry[] }

function ChannelMenu({ users }: Props) {
  return (
    <Container>
      <ChannelUserList users={users} />
    </Container>
  )
}

export default ChannelMenu

const Container = styled.div`
  width: 200px;
  height: 100%;
`
