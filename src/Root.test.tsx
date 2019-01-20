import React from "react"
import { Link, Route, Router, Switch, useRouter } from "./router"

const Root = () => (
  <Router>
    <nav>
      <Link to="/">home</Link> | <Link to="/hi">hi</Link> |{" "}
      <Link to="/the-message">the message</Link>
    </nav>

    <main>
      <Switch>
        <Route path="/hi" children={<p>hi</p>} />
        <Route path="/:message" children={<Hello />} />
        <Route path="/" children={<p>am index</p>} />
      </Switch>
    </main>
  </Router>
)

const Hello = () => {
  const { param } = useRouter()
  return <p>message is {param("message")}</p>
}

export default Root
