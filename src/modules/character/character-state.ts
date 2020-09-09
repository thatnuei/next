import * as fchat from "fchat"
import { createCommandReducer } from "../chat/chat-state"
import { mapUpdate } from "../helpers/mapUpdate"

export type Character = {
	name: string
	gender: fchat.Character.Gender
	status: {
		type: fchat.Character.Status
		text: string
	}
}

export const handleCharacterCommand = createCommandReducer({
	LIS(state, { characters }) {
		for (const [name, gender, type, text] of characters) {
			state.characters.set(name, { name, gender, status: { type, text } })
		}
	},

	NLN(state, { identity, gender, status }) {
		state.characters.set(identity, {
			name: identity,
			gender,
			status: { type: "online", text: status },
		})
	},

	FLN(state, { character }) {
		mapUpdate(state.characters, character, (char) => {
			char.status = { type: "offline", text: "" }
		})
	},

	STA(state, { character, status: type, statusmsg: text }) {
		mapUpdate(state.characters, character, (char) => {
			char.status = { type, text }
		})
	},
})
