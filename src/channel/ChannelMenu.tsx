import React from "react"
import { Character } from "../character/types"
import RoomUserList from "../chat/RoomUserList"
import { styled } from "../ui/styled"

type Props = { users: Character[] }

function ChannelMenu({ users }: Props) {
  return (
    <Container>
      {/* TODO: other menu options, maybe make the user list a JSX prop */}
      <RoomUserList users={users} />
    </Container>
  )
}

export default ChannelMenu

const Container = styled.div`
  height: 100%;
`
