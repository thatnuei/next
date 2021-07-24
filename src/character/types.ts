import type * as fchat from "fchat"

export type CharacterStatus = fchat.Character.Status
export type CharacterGender = fchat.Character.Gender

export interface Friendship {
	us: string
	them: string
}

export interface Character {
	name: string
	gender: CharacterGender
	status: CharacterStatus
	statusMessage: string
}
