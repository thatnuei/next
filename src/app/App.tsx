import React from "react"
import { Session } from "../session/Session"
import { SessionProvider } from "../session/SessionContext"
import { SessionState } from "../session/SessionState"

export interface AppProps {
  session: SessionState
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
