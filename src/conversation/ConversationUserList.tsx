import { observer } from "mobx-react"
import React from "react"
import { AutoSizer, List, ListRowRenderer, Size } from "react-virtualized"
import { CharacterName } from "../character/CharacterName"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"

export interface ConversationUserListProps {
  users: string[]
}

@observer
export class ConversationUserList extends React.Component<ConversationUserListProps> {
  render() {
    return (
      <Container>
        <UserCount>{this.props.users.length} Characters</UserCount>
        <UserList>
          <AutoSizer rowCount={this.props.users.length}>{this.renderList}</AutoSizer>
        </UserList>
      </Container>
    )
  }

  private renderList = (size: Size) => {
    return (
      <List
        {...size}
        rowHeight={32}
        rowCount={this.props.users.length}
        rowRenderer={this.renderListRow}
        overscanRowCount={10}
      />
    )
  }

  private renderListRow: ListRowRenderer = (row) => {
    const name = this.props.users[row.index]
    return (
      <UserListItem key={name} style={row.style}>
        {name && <CharacterName name={name} />}
      </UserListItem>
    )
  }
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
`

const UserListItem = styled.div`
  display: flex;
  align-items: center;

  padding-left: 0.4rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
