import * as fchat from "fchat"
import { observable } from "micro-observables"
import { createCommandHandler } from "./chat/commandHelpers"
import { repository } from "./helpers/repository"

export type Character = {
	name: string
	gender: fchat.Character.Gender
	status: {
		type: fchat.Character.Status
		text: string
	}
}

export class CharacterStore {
	getCharacter = repository((name) => {
		return observable<Character>({
			name,
			gender: "None",
			status: { type: "offline", text: "" },
		})
	})

	handleCommand = createCommandHandler({
		LIS: ({ characters }) => {
			for (const [name, gender, type, text] of characters) {
				this.getCharacter(name).set({
					name,
					gender,
					status: { type, text },
				})
			}
		},

		NLN: ({ identity, gender, status }) => {
			this.getCharacter(identity).set({
				name: identity,
				gender,
				status: { type: "online", text: status },
			})
		},

		FLN: ({ character }) => {
			this.getCharacter(character).update((char) => ({
				...char,
				status: { type: "offline", text: "" },
			}))
		},

		STA: ({ character, status: type, statusmsg: text }) => {
			this.getCharacter(character).update((char) => ({
				...char,
				status: { type, text },
			}))
		},
	})
}
