import { observer } from "mobx-react-lite"
import React from "react"
import CharacterInfo from "../character/CharacterInfo"
import { useRootStore } from "../RootStore"
import { flexColumn, flexRow, spacedChildrenVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import NavigationActions from "./NavigationActions"
import NavigationTabs from "./NavigationTabs"

function ChatNavigation() {
  const { chatStore } = useRootStore()

  return (
    <Nav>
      <NavigationActions />
      <UserInfoAndTabsContainer>
        <UserInfoContainer>
          <CharacterInfo name={chatStore.identity} />
        </UserInfoContainer>
        <NavigationTabsContainer>
          <NavigationTabs />
        </NavigationTabsContainer>
      </UserInfoAndTabsContainer>
    </Nav>
  )
}
export default observer(ChatNavigation)

const Nav = styled.nav`
  ${flexRow};
  height: 100%;
`

const UserInfoAndTabsContainer = styled.div`
  ${flexColumn};
  width: 200px;
  background-color: ${(props) => props.theme.colors.theme2};
  overflow-y: auto;
  ${spacedChildrenVertical(spacing.xsmall)};
`

const UserInfoContainer = styled.div`
  background-color: ${(props) => props.theme.colors.theme0};
  padding: ${spacing.small};
`

const NavigationTabsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.theme1};
  flex: 1;
`
