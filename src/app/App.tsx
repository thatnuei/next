import { observer } from "mobx-react"
import React from "react"
import { NavigationView } from "../navigation/NavigationView"

@observer
export class App extends React.Component {
  render() {
    return <NavigationView />
  }
}
