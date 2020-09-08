/// <reference types="@emotion/react/types/css-prop" />
import "micro-observables/batchingForReactDom"
import React from "react"
import ReactDOM from "react-dom"
import Root from "./root/Root"

ReactDOM.render(<Root />, document.getElementById("root"))