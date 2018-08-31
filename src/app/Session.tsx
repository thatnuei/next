import { observer } from "mobx-react"
import React from "react"
import { Chat } from "../chat/Chat"
import { SessionState } from "../session/SessionState"
import { LoginModal } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

type Props = {
  state: SessionState
}

@observer
export class Session extends React.Component<Props> {
  get state() {
    return this.props.state
  }

  async componentDidMount() {
    try {
      await this.state.restoreUserData()
      this.state.setScreen("selectCharacter")
    } catch (error) {
      console.warn(error)
      this.state.setScreen("login")
    }
  }

  render() {
    switch (this.state.screen) {
      case "setup":
        return <div>Setting things up...</div>
      case "login":
        return <LoginModal session={this.state} />
      case "selectCharacter":
        return <SelectCharacterModal session={this.state} />
      case "chat":
        return <Chat />
    }
  }
}
