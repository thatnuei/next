import { createIdbStorage } from "../storage/idb"

export type UserSession = {
	account: string
	ticket: string
	characters: string[]
}

export const sessionStorage = createIdbStorage<UserSession>("session")
