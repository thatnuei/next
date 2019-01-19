import React from "react"
import { Link, Route, Router, useRouter } from "./router"

const Root = () => (
  <Router>
    <nav>
      <ul>
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/hi">hi</Link>
        </li>
        <li>
          <Link to="/the-message">the message</Link>
        </li>
      </ul>
    </nav>

    <main>
      <Route path="/">
        <p>am index</p>
      </Route>

      <Route path="/hi">
        <p>hi</p>
      </Route>

      <Route path="/:message">
        <Hello />
      </Route>
    </main>
  </Router>
)

const Hello = () => {
  const { param } = useRouter()
  return <p>message is {param("message")}</p>
}

export default Root
