import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"
import CharacterModel from "./character/CharacterModel"
import Root from "./Root"
import RootStore, { RootStoreContext } from "./RootStore"

function renderApp(store: RootStore) {
  ReactDOM.render(
    <RootStoreContext.Provider value={store}>
      <Root />
    </RootStoreContext.Provider>,
    document.querySelector("#root"),
  )
}

let store!: RootStore

function initStoreAndRender() {
  if (store) store.cleanup()

  store = new RootStore()
  store.init()

  // temporary
  store.chatStore.setIdentity("Serena Gardener")

  store.characterStore.characters.set(
    "Serena Gardener",
    new CharacterModel(
      "Serena Gardener",
      "Female",
      "online",
      "look at my amazing status message isn't it great holy shit",
    ),
  )

  store.characterStore.characters.set(
    "Subaru-chan",
    new CharacterModel("Subaru-chan", "Female", "online"),
  )

  renderApp(store)
}

function main() {
  configure({ enforceActions: "observed" })
  initStoreAndRender()

  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./Root", () => renderApp(store))
      module.hot.accept("./RootStore", initStoreAndRender)
    }

    window.store = store
  }
}

main()
