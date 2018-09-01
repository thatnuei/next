import React from "react"
import { CharacterName } from "../character/CharacterName"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"

type Props = {
  users: string[]
}

export const ConversationUserList = (props: Props) => {
  return (
    <Container>
      <UserCount>{props.users.length} Characters</UserCount>
      <UserList>
        {props.users.map((name) => (
          <CharacterName key={name} name={name} />
        ))}
      </UserList>
    </Container>
  )
}

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

  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 0.2rem;
  overflow-y: scroll;
  padding: 0.5rem;
`
