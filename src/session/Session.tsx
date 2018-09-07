import { observer } from "mobx-react"
import React from "react"
import { LoginModal } from "../app/LoginModal"
import { SelectCharacterModal } from "../app/SelectCharacterModal"
import { Chat } from "../chat/Chat"
import { SessionStore } from "./SessionStore"

type Props = {
  state: SessionStore
}

@observer
export class Session extends React.Component<Props> {
  get session() {
    return this.props.state
  }

  render() {
    switch (this.session.screen) {
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
