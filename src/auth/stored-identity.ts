import { createIdbStorage } from "../storage/idb"

export const storedIdentity = (account: string) =>
	createIdbStorage<string>(`identity:${account}`)
