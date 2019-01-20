import React from "react"
import { Link, Redirect, Route, Router, Switch, useRouter } from "./router"

const Root = () => (
  <Router>
    <nav>
      <Link to="/">home</Link> | <Link to="/hi">hi</Link> |{" "}
      <Link to="/message/awesome">the message</Link> |{" "}
      <Link to="/redirect-test">redirect test</Link> | <Link to="/404">not found test</Link>
    </nav>

    <main>
      <Switch default={<p>not found</p>}>
        <Route path="/hi" children={<p>hi</p>} />
        <Route path="/message/:message" children={<Message />} />
        <Redirect from="/redirect-test" to="/" />
        <Route path="/" children={<p>am index</p>} />
      </Switch>

      <Route partial path="/message">
        <p>arbitrarily appears on /message</p>
        <p>yay</p>
      </Route>
    </main>
  </Router>
)

const Message = () => {
  const { param } = useRouter()
  return <p>the message is "{param("message")}"</p>
}

export default Root
