import React from "react"
import CharacterInfo from "../../character/components/CharacterInfo"
import { useSelector, useStore } from "../../store/hooks"
import { getChatIdentity } from "../../store/selectors"
import { fillArea } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { getThemeColor, spacing } from "../../ui/theme"
import NavigationAction from "./NavigationAction"

function Navigation() {
  const identity = useSelector(getChatIdentity())
  const { actions } = useStore()

  return (
    <Container>
      <ActionsContainer>
        <NavigationAction
          title="Channels"
          icon="channels"
          onClick={actions.channel.showChannelBrowser}
        />
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
  background-color: ${getThemeColor("theme0")};
  padding: ${spacing.small};
`

const RoomsContainer = styled.nav`
  grid-area: rooms;
  background-color: ${getThemeColor("theme1")};
`
