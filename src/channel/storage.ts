import { createStoredValue } from "../storage/createStoredValue"
import * as v from "../validation"

const serializedChannelsSchema = v.shape({
	channelsByIdentity: v.dictionary(v.array(v.string)),
})

const getStoredChannels = (account: string) =>
	createStoredValue(`channels:${account}`, serializedChannelsSchema)

export function saveChannels(
	channelIds: string[],
	account: string,
	identity: string,
) {
	const storage = getStoredChannels(account)

	storage
		.update(
			(data) => {
				data.channelsByIdentity[identity] = channelIds
				return data
			},
			() => ({ channelsByIdentity: {} }),
		)
		.catch(console.warn)
}

export async function loadChannels(account: string, identity: string) {
	const storage = getStoredChannels(account)

	const data = await storage.get().catch((error) => {
		console.warn(`could not restore channels:`, error)
		return undefined
	})

	return data?.channelsByIdentity[identity] || []
}
