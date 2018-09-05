import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { AutoSizer, List, ListRowRenderer, Size } from "react-virtualized"
import { CharacterName } from "../character/CharacterName"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"
import { TextInput } from "../ui/TextInput"

export interface ConversationUserListProps {
  users: string[]
}

@observer
export class ConversationUserList extends React.Component<ConversationUserListProps> {
  @observable
  searchText = ""

  @action.bound
  handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.searchText = event.currentTarget.value
  }

  @computed
  get filteredUsers() {
    const queryify = (text: string) => text.toLowerCase().replace(/\s+/g, "")

    const searchText = queryify(this.searchText)
    return this.props.users.filter((name) => queryify(name).includes(searchText))
  }

  render() {
    return (
      <Container>
        <UserCount>{this.props.users.length} Characters</UserCount>
        <UserList>
          <AutoSizer userCount={this.filteredUsers.length}>{this.renderList}</AutoSizer>
        </UserList>
        <TextInput
          placeholder="Search users..."
          value={this.searchText}
          onChange={this.handleSearchChange}
        />
      </Container>
    )
  }

  private renderList = (size: Size) => {
    return (
      <List
        {...size}
        rowCount={this.filteredUsers.length}
        rowHeight={30}
        rowRenderer={this.renderListRow}
      />
    )
  }

  private renderListRow: ListRowRenderer = (row) => {
    const userName = this.filteredUsers[row.index]
    return (
      <UserListItem key={row.key} style={row.style}>
        {userName && <CharacterName name={userName} />}
      </UserListItem>
    )
  }
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
