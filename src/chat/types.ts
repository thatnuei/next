import { CharacterState } from "../character/types"
import { Dict } from "../common/types"
import { Dispatcher } from "../state/Dispatcher"
import { ServerCommand } from "./commands"

export type ChatState = {
  characters: Dict<CharacterState>
}

export type ServerCommandDispatcher = Dispatcher<ServerCommand>

export type ChatCredentials = {
  account: string
  ticket: string
  identity: string
}
