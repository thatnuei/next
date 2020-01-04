import { observer } from "mobx-react-lite"
import React from "react"
import CharacterInfo from "../../character/components/CharacterInfo"
import { Character } from "../../character/types"
import { fillArea } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { getThemeColor, spacing } from "../../ui/theme"
import NavigationAction from "./NavigationAction"

type Props = {
  identityCharacter: Character
  children?: React.ReactNode
}

function Navigation(props: Props) {
  // const root = useRootStore()

  return (
    <Container>
      <ActionsContainer>
        <NavigationAction
          title="Channels"
          icon="channels"
          // onClick={root.channelBrowserStore.showChannelBrowser}
        />
        <NavigationAction
          title="Update Status"
          icon="updateStatus"
          // onClick={root.characterStore.showUpdateStatusScreen}
        />
        <NavigationAction title="Who's Online" icon="users" />
        <NavigationAction title="About" icon="about" />
        <Spacer />
        <NavigationAction title="Logout" icon="logout" />
      </ActionsContainer>
      <CharacterInfoContainer>
        <CharacterInfo {...props.identityCharacter} />
      </CharacterInfoContainer>
      <RoomsContainer>{props.children}</RoomsContainer>
    </Container>
  )
}

export default observer(Navigation)

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
