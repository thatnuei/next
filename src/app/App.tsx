import { observer } from "mobx-react"
import React from "react"
import { fetchCharacters } from "../network/api"
import { ClientCommands } from "../network/types"
import { appStore } from "./AppStore"
import { LoginModal } from "./LoginModal"
import { SelectCharacterModal } from "./SelectCharacterModal"
import { loadAuthData } from "./storage"

class SocketState {
  socket?: WebSocket

  sendCommand = <K extends keyof ClientCommands>(cmd: K, params: ClientCommands[K]) => {
    if (this.socket) {
      this.socket.send(`${cmd} ${JSON.stringify(params)}`)
    }
  }

  connect = (account: string, ticket: string, character: string) => {
    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      this.socket = undefined
    }

    socket.onmessage = () => {}
  }
}

@observer
export class App extends React.Component {
  componentDidMount() {
    this.init()
  }

  render() {
    switch (appStore.screen) {
      case "setup":
        return <div>Setting things up...</div>
      case "login":
        return <LoginModal />
      case "selectCharacter":
        return <SelectCharacterModal />
    }
  }

  private init = async () => {
    try {
      const { account, ticket } = loadAuthData()
      if (!account || !ticket) {
        throw new Error("Account or ticket not found in storage")
      }

      const { characters } = await fetchCharacters(account, ticket)

      appStore.setUserData(account, ticket, characters.sort())
      appStore.setScreen("selectCharacter")
    } catch (error) {
      console.warn(error)
      appStore.setScreen("login")
    }
  }
}
