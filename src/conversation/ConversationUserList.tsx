import { observer } from "mobx-react"
import React from "react"
import { CharacterName } from "../character/CharacterName"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"

type Props = {
  users: Map<string, true>
}

export const ConversationUserList = observer((props: Props) => {
  const users = [...props.users.keys()]
  return (
    <Container>
      <UserCount>{users.length} Characters</UserCount>
      <UserList>
        {users.map((name) => (
          <UserListItem key={name}>
            <CharacterName name={name} />
          </UserListItem>
        ))}
      </UserList>
    </Container>
  )
})

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;

  width: 12rem;
  height: 100%;
`

const UserCount = styled.div`
  padding: 0.5rem 0.7rem;
  background-color: ${flist4};
`

const UserList = styled.div`
  background-color: ${flist5};
  overflow-y: scroll;
  transform: translateZ(0);
  padding-bottom: 0.5rem;
`

const UserListItem = styled.div`
  padding: 0.5rem;
  padding-bottom: 0;
`
