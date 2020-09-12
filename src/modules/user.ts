import { flistFetch } from "./flist"
import { Resource } from "./resource"
import { createIdbStorage } from "./storage/idb"

/// session
type UserSession = {
	account: string
	ticket: string
}

const storedSession = createIdbStorage<UserSession>("session")

export const sessionResource = Resource.of(() => storedSession.get())

/// identity
const storedIdentity = (account: string) =>
	createIdbStorage<string>(`identity:${account}`)

export const identityResource = Resource.of((account: string) => {
	return storedIdentity(account).get()
})

/// character list
type CharacterListData = { characters: string[] }

export const characterListResource = Resource.of((session: UserSession) => {
	return flistFetch<CharacterListData>(`/json/api/character-list.php`, session)
})
