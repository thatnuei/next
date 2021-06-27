import type { AnyAction } from "@reduxjs/toolkit"
import { createAction } from "@reduxjs/toolkit"
import type { Draft } from "immer"
import produce from "immer"
import type { CharacterGender, CharacterStatus } from "../character/types"
import type { Dict } from "../common/types"
import type { CommandHandlerMap, ServerCommand } from "../socket/helpers"

// state types
export interface ChatState {
	readonly characters: Dict<Character>
	readonly friends: { [us: string]: { [them: string]: true } }
	readonly bookmarks: Dict<true>
	readonly ignores: Dict<true>
	readonly admins: Dict<true>
}

export interface Character {
	readonly name: string
	readonly gender: CharacterGender
	readonly status: CharacterStatus
	readonly statusMessage: string
}

// helper fns
function updateCharacter(
	state: Draft<ChatState>,
	{ name, ...properties }: { name: string } & Partial<Character>,
) {
	state.characters[name] = {
		...createCharacter(name),
		...state.characters[name],
		...properties,
	}
}

export function getCharacter(state: ChatState, name: string): Character {
	return state.characters[name] || createCharacter(name)
}

function createCharacter(name: string): Character {
	return { name, gender: "None", status: "offline", statusMessage: "" }
}

function truthyMap(keys: readonly string[]): Record<string, true> {
	return Object.fromEntries(keys.map((key) => [key, true]))
}

// actions
export const serverCommandAction =
	createAction<{ command: ServerCommand; identity: string }>("serverCommand")

// reducer & initial state
export const initialChatState: ChatState = {
	characters: {},
	friends: {},
	bookmarks: {},
	ignores: {},
	admins: {},
}

export const chatStateReducer = produce(
	(state: Draft<ChatState>, action: AnyAction) => {
		if (serverCommandAction.match(action)) {
			const { command, identity } = action.payload

			const handlers: CommandHandlerMap = {
				LIS({ characters }) {
					for (const [name, gender, status, statusMessage] of characters) {
						updateCharacter(state, { name, gender, status, statusMessage })
					}
				},

				NLN({ identity: name, gender, status }) {
					updateCharacter(state, { name, gender, status })
				},

				FLN({ character: name }) {
					updateCharacter(state, { name, status: "offline", statusMessage: "" })
				},

				STA({ character: name, status, statusmsg }) {
					updateCharacter(state, { name, status, statusMessage: statusmsg })
				},

				IGN(params) {
					if (params.action === "init" || params.action === "list") {
						state.ignores = Object.fromEntries(
							params.characters.map((name) => [name, true]),
						)
					}
					if (params.action === "add") {
						state.ignores[params.character] = true
					}
					if (params.action === "delete") {
						delete state.ignores[params.character]
					}
				},

				ADL({ ops }) {
					state.admins = truthyMap(ops)
				},

				RTB(params) {
					if (params.type === "trackadd") {
						state.bookmarks[params.name] = true
						// show toast
					}

					if (params.type === "trackrem") {
						delete state.bookmarks[params.name]
						// show toast
					}

					if (params.type === "friendadd") {
						;(state.friends[identity] ??= {})[params.name] = true
						// show toast
					}

					if (params.type === "friendremove") {
						delete (state.friends[identity] ??= {})[params.name]
						// show toast
					}
				},
			}

			handlers[command.type]?.(command.params as never)
		}
	},
)
