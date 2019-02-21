import FListApiService from "../flist/FListApiService"
import UserStore, { credentialsKey } from "./UserStore"

const account = "ayylmao"
const ticket = "djsaifhsdkfhafjklhjkl"
const characters = ["alli", "iki", "yui"]

class MockApi extends FListApiService {
  async authenticate() {
    return { ticket, characters }
  }

  async fetchCharacters() {
    return { characters }
  }
}

const createStore = () => {
  const mockStorage = {
    items: new Map(),
    async get(key: string) {
      return this.items.get(key)
    },
    async set(key: string, value: any) {
      this.items.set(key, value)
    },
  }

  const store = new UserStore(new MockApi(), mockStorage as any)

  return { store, mockStorage }
}

const assertUserData = (store: UserStore) => {
  expect(store.account).toBe(account)
  expect(store.ticket).toBe(ticket)
  expect(store.characters).toBe(characters)
}

test("submitLogin", async () => {
  const { store, mockStorage } = createStore()

  await store.submitLogin(account, "anything")

  assertUserData(store)

  expect(mockStorage.items.get(credentialsKey)).toEqual({
    account,
    ticket,
  })
})

test("restoreSession", async () => {
  const { store, mockStorage } = createStore()

  await mockStorage.set(credentialsKey, { account, ticket })
  await store.restoreUserData()

  assertUserData(store)
})

test("restoreSession - errors if credentials not stored", async () => {
  const { store } = createStore()
  expect(store.restoreUserData()).rejects.toHaveProperty("message")
})
