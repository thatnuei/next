import { observer } from "mobx-react-lite"
import React from "react"
import CharacterInfo from "../character/CharacterInfo"
import { fillArea } from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import { useCharacter, useIdentity } from "./ChatContext"

type Props = {
  actions: React.ReactNode
  children: React.ReactNode
}

function Navigation(props: Props) {
  const identity = useIdentity()
  const identityCharacter = useCharacter(identity)
  return (
    <Container>
      <ActionsContainer>{props.actions}</ActionsContainer>
      <CharacterInfoContainer>
        <CharacterInfo {...identityCharacter} />
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

const CharacterInfoContainer = styled.div`
  grid-area: character-info;
  background-color: ${getThemeColor("theme0")};
  padding: ${spacing.small};
`

const RoomsContainer = styled.nav`
  grid-area: rooms;
  background-color: ${getThemeColor("theme1")};
`
