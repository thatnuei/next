import { observer } from "mobx-react"
import React from "react"
import posed, { PoseGroup } from "react-pose"
import { rootStore } from "../app/RootStore"
import { NavigationScreen } from "./NavigationStore"

const RouteContainer = posed.div()

@observer
export class NavigationView extends React.Component {
  render() {
    return (
      <PoseGroup animateOnMount>
        {rootStore.navigationStore.screens.map(this.renderScreen)}
      </PoseGroup>
    )
  }

  private renderScreen = (screen: NavigationScreen) => (
    <RouteContainer key={screen.key}>
      {screen.render({ close: () => rootStore.navigationStore.removeView(screen.key) })}
    </RouteContainer>
  )
}
