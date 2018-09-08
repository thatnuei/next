import React from "react"
import { Chat } from "../chat/Chat"
import { SessionStore } from "../session/SessionStore"
import { LoginModal } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

export interface AppProps {
  session: SessionStore
}

export class App extends React.Component<AppProps> {
  get session() {
    return this.props.session
  }

  render() {
    switch (this.session.appViewStore.screen) {
      case "setup":
        return <div>Setting things up...</div>
      case "login":
        return <LoginModal session={this.session} />
      case "selectCharacter":
        return <SelectCharacterModal session={this.session} />
      case "chat":
        return <Chat session={this.session} />
    }
  }
}
