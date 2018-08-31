import { observer } from "mobx-react"
import React from "react"
import { Chat } from "../chat/Chat"
import { SessionState } from "../session/SessionState"
import { LoginModal } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"

type Props = {
  session: SessionState
}

@observer
export class App extends React.Component<Props> {
  get session() {
    return this.props.session
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
        return <Chat />
    }
  }
}
