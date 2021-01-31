import * as fchat from "fchat"
import { observable, WritableObservable } from "micro-observables"

export type CharacterStatus = { type: CharacterStatusType; text: string }
export type CharacterStatusType = fchat.Character.Status
type CharacterGender = fchat.Character.Gender

// TODO: use plain JS object for character state
// this model is probably unnecessary and makes things more complicated
export class CharacterModel {
	readonly name: WritableObservable<string>
	readonly gender = observable<CharacterGender>("None")
	readonly status = observable<CharacterStatus>({ type: "offline", text: "" })

	constructor(readonly id: string, name: string) {
		this.name = observable(name)
	}
}
