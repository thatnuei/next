import React from "react"
import CharacterInfo from "../../character/components/CharacterInfo"
import { getChatIdentity } from "../../store/chat/selectors"
import { useSelector } from "../../store/hooks"
import { fillArea } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import NavigationAction from "./NavigationAction"

function Navigation() {
  const identity = useSelector(getChatIdentity())

  return (
    <Container>
      <ActionsContainer>
        <NavigationAction title="Channels" icon="channels" />
        <NavigationAction title="Update Status" icon="updateStatus" />
        <NavigationAction title="Who's Online" icon="users" />
        <NavigationAction title="About" icon="about" />
        <Spacer />
        <NavigationAction title="Logout" icon="logout" />
      </ActionsContainer>
      <CharacterInfoContainer>
        <CharacterInfo name={identity} />
      </CharacterInfoContainer>
      <RoomsContainer>rooms</RoomsContainer>
    </Container>
  )
}

export default Navigation

const Container = styled.div`
  ${fillArea};

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "actions character-info"
    "actions rooms";
  grid-row-gap: ${spacing.xsmall};
`

const ActionsContainer = styled.nav`
  grid-area: actions;

  display: flex;
  flex-direction: column;
  padding: ${spacing.xsmall} 0;
`

const Spacer = styled.div`
  flex: 1;
`

const CharacterInfoContainer = styled.div`
  grid-area: character-info;
  background-color: ${({ theme }) => theme.colors.theme0};
  padding: ${spacing.small};
`

const RoomsContainer = styled.nav`
  grid-area: rooms;
  background-color: ${({ theme }) => theme.colors.theme1};
`
