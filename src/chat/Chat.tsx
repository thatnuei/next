import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { CharacterGender, CharacterStatus } from "../character/types"
import { chatServerUrl } from "../fchat/constants"
import { ClientCommands, ServerCommands } from "../fchat/types"
import { Values } from "../helpers/types"

export type ChatProps = {
  account: string
  ticket: string
  character: string
  onDisconnect: () => void
}

type CharacterData = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}

type OptionalArg<T> = T extends undefined ? [] : [T]

type ServerCommand = Values<{ [K in keyof ServerCommands]: { type: K; params: ServerCommands[K] } }>

@observer
export class Chat extends React.Component<ChatProps> {
  @observable.shallow
  private characters = new Map<string, CharacterData>()

  private socket?: WebSocket

  private sendCommand<K extends keyof ClientCommands>(
    command: K,
    ...args: OptionalArg<ClientCommands[K]>
  ) {
    const [params] = args
    if (this.socket) {
      if (params) {
        this.socket.send(`${command} ${JSON.stringify(params)}`)
      } else {
        this.socket.send(command)
      }
    }
  }

  private openConnection() {
    const socket = (this.socket = new WebSocket(chatServerUrl))

    socket.onopen = () => {
      const { account, ticket, character } = this.props

      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "next",
        cversion: "0.1.0",
        method: "ticket",
      })
    }

    socket.onmessage = ({ data }) => {
      const type = data.slice(0, 3)
      const params = data.length > 3 ? JSON.parse(data.slice(4)) : {}
      const command: ServerCommand = { type, params }

      if (type === "PIN") {
        this.sendCommand("PIN")
        return
      }

      this.handleCommand(command)
    }

    socket.onclose = () => {
      this.props.onDisconnect()
    }
  }

  @action
  private handleCommand = (command: ServerCommand) => {
    switch (command.type) {
      case "LIS": {
        for (const [name, gender, status, statusMessage] of command.params.characters) {
          this.characters.set(name, { name, gender, status, statusMessage })
        }
        break
      }
    }
  }

  componentDidMount() {
    this.openConnection()
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.onclose = null
      this.socket.close()
    }
  }

  render() {
    console.log(this.characters)
    const characters = [...this.characters.values()]
    const char = characters[characters.length - 1] as CharacterData | undefined
    return <div>last character: {char ? char.name : "unknown"}</div>
  }
}
