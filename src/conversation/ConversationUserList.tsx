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
          <AutoSizer userCount={this.props.users.length}>{this.renderList}</AutoSizer>
        </UserList>
      </Container>
    )
  }

  private renderList = (size: Size) => {
    return (
      <List
        {...size}
        rowCount={this.props.users.length}
        rowHeight={30}
        rowRenderer={this.renderListRow}
      />
    )
  }

  private renderListRow: ListRowRenderer = (row) => {
    const userName = this.props.users[row.index]
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
