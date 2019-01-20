import React from "react"
import { Link, Redirect, Route, Router, Switch, useRouter } from "./router"

const Root = () => (
  <Router>
    <nav>
      <Link to="/">home</Link> | <Link to="/hi">hi</Link> |{" "}
      <Link to="/message/the-message">the message</Link> |{" "}
      <Link to="/redirect-test">redirect test</Link>
    </nav>

    <main>
      <Switch>
        <Route path="/hi" children={<p>hi</p>} />
        <Route path="/message/:message" children={<Hello />} />
        <Route exact path="/" children={<p>am index</p>} />
        <Redirect to="/" />
      </Switch>
    </main>
  </Router>
)

const Hello = () => {
  const { param } = useRouter()
  return <p>message is {param("message")}</p>
}

export default Root
