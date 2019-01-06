import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import SessionContainer from "./session/SessionContainer"
import GlobalStyle from "./ui/GlobalStyle"

function render() {
  ReactDOM.render(
    <SessionContainer.Provider>
      <App />
      <GlobalStyle />
    </SessionContainer.Provider>,
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
