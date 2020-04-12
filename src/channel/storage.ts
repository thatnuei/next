import { ChatState } from "../chat/ChatState"
import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"

const serializedChannelsSchema = v.shape({
  channelsByIdentity: v.dictionary(
    v.array(
      v.shape({
        id: v.string,
        title: v.string,
      }),
    ),
  ),
})

const getStoredChannels = (account: string) =>
  createStoredValue(`channels:${account}`, serializedChannelsSchema)

export function saveChannels(
  state: ChatState,
  account: string,
  identity: string,
) {
  const joinedChannels = [...state.channels.values()].filter(
    (it) => it.joinState === "present",
  )

  const storage = getStoredChannels(account)

  storage.update(
    (data) => {
      data.channelsByIdentity[identity] = joinedChannels.map((it) => ({
        id: it.id,
        title: it.title,
      }))
      return data
    },
    () => ({ channelsByIdentity: {} }),
  )
}

export async function loadChannels(account: string, identity: string) {
  const storage = getStoredChannels(account)

  const data = await storage.get().catch((error) => {
    console.warn(`could not restore channels:`, error)
    return undefined
  })

  return data?.channelsByIdentity[identity] || []
}
