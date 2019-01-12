import { observer } from "mobx-react"
import React from "react"
import posed, { PoseGroup } from "react-pose"
import { appStore } from "../store"
import { NavigationScreen } from "./NavigationStore"

const RouteContainer = posed.div()

@observer
export class NavigationView extends React.Component {
  render() {
    return (
      <PoseGroup animateOnMount>
        {appStore.navigationStore.screens.map(this.renderScreen)}
      </PoseGroup>
    )
  }

  private renderScreen = (screen: NavigationScreen) => (
    <RouteContainer key={screen.key}>
      {screen.render({ close: () => appStore.navigationStore.removeView(screen.key) })}
    </RouteContainer>
  )
}
