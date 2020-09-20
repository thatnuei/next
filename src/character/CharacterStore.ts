import { observable, WritableObservable } from "micro-observables"
import { createCommandHandler } from "../chat/chatCommand"
import { Character } from "./types"

export class CharacterStore {
	private readonly characters: Record<
		string,
		WritableObservable<Character>
	> = {}

	handleCommand = createCommandHandler({
		LIS: ({ characters }) => {
			for (const [name, gender, type, text] of characters) {
				this.characters[name] = observable({
					name,
					gender,
					status: { type, text },
				})
			}
		},

		NLN: ({ identity, gender, status }) => {
			this.characters[identity] = observable({
				name: identity,
				gender,
				status: { type: "online", text: status },
			})
		},

		FLN: ({ character: name }) => {
			const char = (this.characters[name] ||= observable({
				name,
				gender: "None",
				status: { type: "offline", text: "" },
			}))

			char.update((char) => ({
				...char,
				status: { type: "offline", text: "" },
			}))
		},

		STA: ({ character: name, status: type, statusmsg: text }) => {
			const char = (this.characters[name] ||= observable({
				name,
				gender: "None",
				status: { type: "offline", text: "" },
			}))

			char.update((char) => ({
				...char,
				status: { type, text },
			}))
		},
	})
}
