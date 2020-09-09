import produce, { Draft } from "immer"
import { Character } from "../character/character-state"
import { ServerCommand, ServerCommandRecord } from "./socket-command"

export type ChatState = {
	characters: Map<string, Character>
}

export const initialChatState: ChatState = {
	characters: new Map(),
}

type ReducerRecord = {
	[K in keyof ServerCommandRecord]?: (
		state: Draft<ChatState>,
		params: ServerCommandRecord[K],
	) => void | ChatState
}

export function createCommandReducer(handlers: ReducerRecord) {
	return (state: ChatState, command: ServerCommand) => {
		return produce(state, (draft) => {
			return handlers[command.type]?.(draft, command.params as never)
		})
	}
}
