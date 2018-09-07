import React from "react"
import { Session } from "../session/Session"
import { SessionProvider } from "../session/SessionContext"
import { SessionStore } from "../session/SessionStore"

export interface AppProps {
  session: SessionStore
}

export class App extends React.Component<AppProps> {
  render() {
    return (
      <SessionProvider value={this.props.session}>
        <Session state={this.props.session} />
      </SessionProvider>
    )
  }
}
