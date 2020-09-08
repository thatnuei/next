import { createIdbStorage } from "../storage/idb"

export type UserSession = {
	account: string
	ticket: string
}

export const storedUserSession = createIdbStorage<UserSession>("session")
