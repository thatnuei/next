import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import AppStateContainer from "./app/AppStateContainer"
import GlobalStyle from "./ui/GlobalStyle"

function render() {
  ReactDOM.render(
    <AppStateContainer.Provider>
      <App />
      <GlobalStyle />
    </AppStateContainer.Provider>,
    document.querySelector("#root"),
  )
}

function main() {
  render()

  if (module.hot) {
    module.hot.accept("./app/App", () => render())
  }
}

main()
