import React from "react"
import CharacterName from "../../character/components/CharacterName.new"
import { Character } from "../../character/types"
import VirtualizedList from "../../ui/components/VirtualizedList"
import {
  fillArea,
  flexColumn,
  flexGrow,
  scrollVertical,
} from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { getThemeColor, spacing } from "../../ui/theme"

type Props = {
  users: Character[]
}

function RoomUserList(props: Props) {
  return (
    <Container>
      <UserCount>Characters: {props.users.length}</UserCount>
      <ListContainer>
        <VirtualizedList
          items={props.users}
          itemHeight={30}
          getItemKey={(user) => user.name}
          renderItem={(character) => (
            <ListItem>
              <CharacterName character={character} />
            </ListItem>
          )}
        />
      </ListContainer>
    </Container>
  )
}

export default RoomUserList

const Container = styled.div`
  ${fillArea};
  ${flexColumn};
  background-color: ${getThemeColor("theme1")};
`

const ListItem = styled.div`
  ${fillArea};
  ${flexColumn};
  justify-content: center;
  padding-left: ${spacing.xsmall};
  white-space: nowrap;
`

const UserCount = styled.div`
  background-color: ${getThemeColor("theme0")};
  padding: ${spacing.xsmall};
`

const ListContainer = styled.div`
  ${flexGrow};
  ${scrollVertical};
`
