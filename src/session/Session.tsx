import { observer } from "mobx-react"
import React from "react"
import { LoginModal } from "../app/LoginModal"
import { SelectCharacterModal } from "../app/SelectCharacterModal"
import { Chat } from "../chat/Chat"
import { SessionState } from "./SessionState"

type Props = {
  state: SessionState
}

@observer
export class Session extends React.Component<Props> {
  get session() {
    return this.props.state
  }

  async componentDidMount() {
    try {
      await this.session.restoreUserData()
      this.session.setScreen("selectCharacter")
    } catch (error) {
      console.warn(error)
      this.session.setScreen("login")
    }
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
