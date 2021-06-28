import type * as fchat from "fchat"

export type CharacterStatus = fchat.Character.Status
export type CharacterGender = fchat.Character.Gender

export interface Friendship {
	us: string
	them: string
}

export interface Character {
	readonly name: string
	readonly gender: CharacterGender
	readonly status: CharacterStatus
	readonly statusMessage: string
}
