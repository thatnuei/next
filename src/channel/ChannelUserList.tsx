import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { AutoSizer, List, ListRowProps, ListRowRenderer, Size } from "react-virtualized"
import { CharacterName } from "../character/CharacterName"
import { observerCallback } from "../helpers/mobx"
import { sort } from "../helpers/sort"
import { queryify } from "../helpers/string"
import { NavigationScreen } from "../navigation/NavigationStore"
import { appStore } from "../store"
import { flist4, flist5 } from "../ui/colors"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { TextInput } from "../ui/TextInput"

export interface ChannelUserListProps {
  users: string[]
  ops: Map<string, true>
}

@observer
export class ChannelUserList extends React.Component<ChannelUserListProps> {
  @observable
  searchText = ""

  @action.bound
  handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.searchText = event.currentTarget.value
  }

  @computed
  get processedUsers() {
    const searchText = queryify(this.searchText)
    const filteredUsers = this.props.users.filter((name) => queryify(name).includes(searchText))

    const getCharacter = (name: string) => appStore.characterStore.getCharacter(name)

    const adminsFirst = (name: string) => (appStore.chatStore.admins.has(name) ? 0 : 1)
    const channelOpsFirst = (name: string) => (this.props.ops.has(name) ? 0 : 1)
    const lookingFirst = (name: string) => (getCharacter(name).status === "looking" ? 0 : 1)
    const byName = (name: string) => name.toLocaleLowerCase()

    return sort(filteredUsers, adminsFirst, channelOpsFirst, lookingFirst, byName)
  }

  render() {
    return (
      <Container>
        <UserCount>{this.props.users.length} Characters</UserCount>
        <UserList>
          <AutoSizer>{this.renderList}</AutoSizer>
        </UserList>
        <TextInput
          placeholder="Search users..."
          value={this.searchText}
          onChange={this.handleSearchChange}
        />
      </Container>
    )
  }

  private renderList = observerCallback((size: Size) => {
    return (
      <List
        {...size}
        rowCount={this.processedUsers.length}
        rowHeight={30}
        rowRenderer={this.renderListRow}
      />
    )
  })

  private renderListRow: ListRowRenderer = (row) => {
    return (
      <UserListItem key={row.key} style={row.style}>
        {this.renderRowContent(row)}
      </UserListItem>
    )
  }

  private renderRowContent = observerCallback((row: ListRowProps) => {
    const userName = this.processedUsers[row.index] as string | undefined
    return userName && <CharacterName name={userName} />
  })
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  width: 12rem;
  height: 100%;

  background-color: ${flist4};
`

const UserCount = styled.div`
  padding: 0.5rem 0.7rem;
  background-color: ${flist4};
`

const UserList = styled.div`
  background-color: ${flist5};
`

const UserListItem = styled.div`
  display: flex;
  align-items: center;

  padding-left: 0.4rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const channelUserListOverlay = (
  users: string[],
  ops: Map<string, true>,
): NavigationScreen => ({
  key: "userList",
  render: ({ close }) => (
    <Overlay anchor="right" onShadeClick={close}>
      {users && <ChannelUserList users={users} ops={ops} />}
    </Overlay>
  ),
})
