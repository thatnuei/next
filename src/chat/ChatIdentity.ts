import { action, autorun, computed, observable } from "mobx"
import Reference from "../state/classes/Reference"
import StoredValue from "../storage/StoredValue"
import { UserCredentials } from "../user/types"

export default class ChatIdentity {
  @observable
  current = ""

  constructor(private credentials: Reference<UserCredentials>) {
    autorun(() => {
      this.storage.get().then((identity) => identity && this.set(identity))
    })
  }

  @computed
  private get storage() {
    return new StoredValue<string>(`identity:${this.credentials.value.account}`)
  }

  @action
  set = (newIdentity: string) => {
    this.current = newIdentity
  }
}
