import { rgba } from "polished"
import React from "react"
import CharacterModel from "../character/CharacterModel"
import CharacterName from "../character/components/CharacterName"
import VirtualizedList from "../ui/components/VirtualizedList"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import useRootStore from "../useRootStore"
import ChannelModel from "./ChannelModel"

type Props = {
  users: ListEntry[]
}

type ListEntry = {
  name: string
  highlight: string | undefined
}

function ChannelUserList(props: Props) {
  const renderUser = ({ name, highlight }: ListEntry) => (
    <ListItem style={{ backgroundColor: highlight }}>
      <CharacterName name={name} />
    </ListItem>
  )

  return (
    <Container>
      <UserCount>Characters: {props.users.length}</UserCount>
      <ListContainer>
        <VirtualizedList
          items={props.users}
          itemHeight={30}
          getItemKey={(entry) => entry.name}
          renderItem={renderUser}
        />
      </ListContainer>
    </Container>
  )
}

export default ChannelUserList

export function useChannelUserListEntries(channel: ChannelModel): ListEntry[] {
  const { chatStore } = useRootStore()

  function getHighlight(character: CharacterModel): string | undefined {
    if (chatStore.isFriend(character.name)) return rgba(46, 204, 113, 0.15)
    if (chatStore.isAdmin(character.name)) return rgba(231, 76, 60, 0.15)
    if (channel.ops.has(character.name)) return rgba(241, 196, 15, 0.15)
  }

  return channel.sortedUsers.map((user) => ({
    name: user.name,
    highlight: getHighlight(user),
  }))
}

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
