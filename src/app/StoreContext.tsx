import React, { ConsumerProps } from "react"
import { observerCallback } from "../helpers/mobx"
import { AppStore } from "./AppStore"

const { Provider, Consumer } = React.createContext(new AppStore())

export const StoreProvider = Provider

// make sure consumers callback functions are observers
export class StoreConsumer extends React.Component<ConsumerProps<AppStore>> {
  return() {
    return <Consumer>{this.renderChildren}</Consumer>
  }

  private renderChildren = observerCallback((store: AppStore) => this.props.children(store))
}
