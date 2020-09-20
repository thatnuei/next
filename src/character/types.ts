import * as fchat from "fchat"

export type Character = {
	name: string
	gender: fchat.Character.Gender
	status: {
		type: fchat.Character.Status
		text: string
	}
}
