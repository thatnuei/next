import { observer } from "mobx-react-lite"
import { rgba } from "polished"
import React from "react"
import CharacterModel from "../character/CharacterModel"
import CharacterName from "../character/components/CharacterName"
import VirtualizedList from "../ui/components/VirtualizedList"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import ChannelModel from "./ChannelModel"

function ChannelUserList({ channel }: { channel: ChannelModel }) {
  // const { chatStore } = useRootStore()
  const { sortedUsers } = channel

  const getHighlight = (name: string) => {
    // if (chatStore.isFriend(name)) return rgba(46, 204, 113, 0.15)
    // if (chatStore.isAdmin(name)) return rgba(231, 76, 60, 0.15)
    if (channel.ops.has(name)) return rgba(241, 196, 15, 0.15)
  }

  const renderUser = (character: CharacterModel) => (
    <ListItem style={{ backgroundColor: getHighlight(character.name) }}>
      <CharacterName name={character.name} />
    </ListItem>
  )

  return (
    <Container>
      <UserCount>Characters: {sortedUsers.length}</UserCount>
      <ListContainer>
        <VirtualizedList
          items={channel.sortedUsers}
          itemHeight={30}
          getItemKey={(user) => user.name}
          renderItem={renderUser}
        />
      </ListContainer>
    </Container>
  )
}

export default observer(ChannelUserList)

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
