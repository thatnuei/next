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

type ChatState = {
  characters: { [name: string]: CharacterData | undefined }
  lastCommand?: keyof ServerCommands
}

type OptionalArg<T> = T extends undefined ? [] : [T]

type ServerCommand = Values<{ [K in keyof ServerCommands]: { type: K; params: ServerCommands[K] } }>

export class Chat extends React.Component<ChatProps, ChatState> {
  state: ChatState = {
    characters: {},
  }

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

      this.setState(this.handleCommand(command))
      this.setState({ lastCommand: command.type })

      console.log(type, params)
    }

    socket.onclose = () => {
      this.props.onDisconnect()
    }
  }

  private handleCommand = (command: ServerCommand) => (state: ChatState) => {
    switch (command.type) {
      case "LIS": {
        const newCharacters: ChatState["characters"] = {}
        for (const [name, gender, status, statusMessage] of command.params.characters) {
          newCharacters[name] = { name, gender, status, statusMessage }
        }
        return { characters: { ...state.characters, ...newCharacters } }
      }
    }

    return state
  }

  componentDidMount() {
    this.openConnection()
  }

  shouldComponentUpdate(_: any, nextState: ChatState) {
    return nextState.lastCommand !== "LIS"
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.onclose = null
      this.socket.close()
    }
  }

  render() {
    console.log("render")
    return <div>am chat</div>
  }
}
