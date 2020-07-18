import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"

const getStoredPrivateChats = (identity: string) =>
  createStoredValue(`privateChats:${identity}`, v.dictionary(v.array(v.string)))

export function savePrivateChats(identity: string, partnerNames: string[]) {
  getStoredPrivateChats(identity).update(
    (data) => {
      data[identity] = partnerNames
      return data
    },
    () => ({}),
  )
}

export async function restorePrivateChats(identity: string): Promise<string[]> {
  const data = await getStoredPrivateChats(identity).get()
  return data?.[identity] || []
}
