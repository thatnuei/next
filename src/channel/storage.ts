import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"

const serializedChannelsSchema = v.shape({
  channelsByIdentity: v.dictionary(v.array(v.string)),
})

const getStoredChannels = (identity: string) =>
  createStoredValue(`channels:${identity}`, serializedChannelsSchema)

export function saveChannels(channelIds: string[], identity: string) {
  const storage = getStoredChannels(identity)

  storage
    .update(
      (data) => {
        data.channelsByIdentity[identity] = channelIds
        return data
      },
      () => ({ channelsByIdentity: {} }),
    )
    // eslint-disable-next-line no-console
    .catch(console.warn)
}

export async function loadChannels(identity: string) {
  const storage = getStoredChannels(identity)

  const data = await storage.get().catch((error) => {
    // eslint-disable-next-line no-console
    console.warn(`could not restore channels:`, error)
    return undefined
  })

  return data?.channelsByIdentity[identity] || []
}
