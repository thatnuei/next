import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/components/Avatar"
import CharacterNameNew from "../character/components/CharacterName.new"
import CharacterStatus from "../character/components/CharacterStatus"
import { Character } from "../character/types"
import SidebarMenuButton from "../chat/components/SidebarMenuButton"
import { flexColumn, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"

type Props = { character: Character }

function PrivateChatHeader({ character }: Props) {
  return (
    <Container>
      <SidebarMenuButton />
      <Avatar name={character.name} size={50} />
      <div css={flexColumn}>
        <CharacterNameNew character={character} />
        <CharacterStatus {...character} />
      </div>
    </Container>
  )
}

export default observer(PrivateChatHeader)

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.theme0};
  padding: ${spacing.small};

  display: flex;
  align-items: center;
  ${spacedChildrenHorizontal(spacing.small)};
`
