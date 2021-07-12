import * as jotai from "jotai"
import * as jotaiUtils from "jotai/utils"
import { useCallback } from "react"
import { charactersAtom } from "../character/state"
import type { Character } from "../character/types"
import { isPresent } from "../common/isPresent"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { TruthyMap } from "../common/types"
import {
	createAdMessage,
	createChannelMessage,
	createSystemMessage,
} from "../message/MessageState"
import { roomKey, useRoomActions } from "../room/state"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { useAccount, useIdentity } from "../user"
import { loadChannels, saveChannels } from "./storage"
import type { ChannelMode } from "./types"

export interface Channel {
	readonly id: string
	readonly title: string
	readonly description: string
	readonly mode: ChannelMode
	readonly selectedMode: ChannelMode
	readonly users: TruthyMap
	readonly ops: TruthyMap
	readonly isUnread: boolean
	readonly chatInput: string
}

function createChannel(id: string): Channel {
	return {
		id,
		title: id,
		description: "",
		mode: "both",
		selectedMode: "chat",
		users: {},
		ops: {},
		isUnread: false,
		chatInput: "",
	}
}

export const channelRoomKey = (channelId: string) =>
	roomKey(`channel:${channelId}`)

const channelAtom = jotaiUtils.atomFamily((id: string) => {
	return jotai.atom<Channel>(createChannel(id))
})

// todo: represent join states instead of just booleans (?)
const joinedChannelIdsAtom = jotai.atom<TruthyMap>({})

const joinedChannelsAtom = jotai.atom((get): readonly Channel[] => {
	const joinedChannelIds = get(joinedChannelIdsAtom)
	return Object.keys(joinedChannelIds).map((id) => get(channelAtom(id)))
})

const isChannelJoinedAtom = jotaiUtils.atomFamily((id: string) =>
	jotai.atom((get) => get(joinedChannelIdsAtom)[id] ?? false),
)

const channelCharacters = jotaiUtils.atomFamily((channelId: string) => {
	return jotai.atom((get): readonly Character[] => {
		const channelUsers = get(channelAtom(channelId)).users
		const characters = get(charactersAtom)

		return Object.keys(channelUsers)
			.map((userId) => characters[userId])
			.filter(isPresent)
	})
})

export function useChannel(id: string) {
	return jotai.useAtom(channelAtom(id))[0]
}

export function useJoinedChannels() {
	return jotai.useAtom(joinedChannelsAtom)[0]
}

export function useIsChannelJoined(id: string) {
	return jotai.useAtom(isChannelJoinedAtom(id))[0]
}

export function useChannelCharacters(id: string) {
	return jotai.useAtom(channelCharacters(id))[0]
}

export function useActualChannelMode(id: string) {
	const channel = useChannel(id)
	return channel.mode === "both" ? channel.selectedMode : channel.mode
}

export function useChannelActions() {
	const { send } = useSocketActions()
	const identity = useIdentity()

	const updateChannel = jotaiUtils.useAtomCallback(
		useCallback((get, set, properties: Partial<Channel> & { id: string }) => {
			set(channelAtom(properties.id), (prev) => ({ ...prev, ...properties }))
		}, []),
	)

	const { addMessage } = useRoomActions()

	const join = useCallback(
		(id: string, title?: string) => {
			send({
				type: "JCH",
				params: { channel: id },
			})

			if (title) {
				updateChannel({ id, title })
			}
		},
		[send, updateChannel],
	)

	const leave = useCallback(
		(id: string) => {
			send({
				type: "LCH",
				params: {
					channel: id,
				},
			})
		},
		[send],
	)

	const sendMessage = useCallback(
		({ id, message }: { id: string; message: string }) => {
			if (!identity) return
			send({ type: "MSG", params: { channel: id, message } })
			addMessage(channelRoomKey(id), createChannelMessage(identity, message))
		},
		[addMessage, identity, send],
	)

	return {
		join,
		leave,
		sendMessage,
		updateChannel,
	}
}

export function useChannelCommandListener() {
	const identity = useIdentity()
	const account = useAccount()
	const { join } = useChannelActions()
	const { addMessage } = useRoomActions()

	const handler = useCallback(
		(get: jotai.Getter, set: jotai.Setter, command: ServerCommand) => {
			matchCommand(command, {
				async IDN() {
					set(joinedChannelIdsAtom, {})

					if (account && identity) {
						const channelIds = await loadChannels(account, identity)
						for (const id of channelIds) {
							join(id)
						}
					}
				},

				JCH({ channel: id, character: { identity: name }, title }) {
					if (name === identity) {
						set(
							joinedChannelIdsAtom,
							(prev): TruthyMap => ({ ...prev, [id]: true }),
						)
					}

					set(
						channelAtom(id),
						(prev): Channel => ({
							...prev,
							title,
							users: { ...prev.users, [name]: true },
						}),
					)

					if (account && identity) {
						saveChannels(
							Object.entries(get(joinedChannelIdsAtom))
								.filter(([, joined]) => joined)
								.map(([id]) => id),
							account,
							identity,
						)
					}
				},

				LCH({ channel: id, character }) {
					if (character === identity) {
						set(joinedChannelIdsAtom, (prev) => omit(prev, [id]))
					}

					set(channelAtom(id), (prev) => ({
						...prev,
						users: omit(prev.users, [character]),
					}))

					if (account && identity) {
						saveChannels(
							Object.entries(get(joinedChannelIdsAtom))
								.filter(([, joined]) => joined)
								.map(([id]) => id),
							account,
							identity,
						)
					}
				},

				FLN({ character }) {
					// normally we'd want to clear _all_ channels,
					// but we're fine with just clearing the joined channels.
					// for unjoined channels, we get an ICH of all the users anyway on join
					for (const id of Object.keys(get(joinedChannelIdsAtom))) {
						set(channelAtom(id), (prev) => ({
							...prev,
							users: omit(prev.users, [character]),
						}))
					}
				},

				ICH({ channel: id, users, mode }) {
					set(channelAtom(id), (prev) => ({
						...prev,
						mode,
						users: truthyMap(users.map((user) => user.identity)),
					}))
				},

				CDS({ channel: id, description }) {
					set(channelAtom(id), (prev) => ({
						...prev,
						description,
					}))
				},

				COL({ channel: id, oplist }) {
					set(channelAtom(id), (prev) => ({
						...prev,
						ops: truthyMap(oplist),
					}))
				},

				MSG({ channel: id, message, character }) {
					addMessage(
						channelRoomKey(id),
						createChannelMessage(character, message),
					)
				},

				LRP({ channel: id, character, message }) {
					addMessage(channelRoomKey(id), createAdMessage(character, message))
				},

				RLL(params) {
					if ("channel" in params) {
						addMessage(
							// bottle messages have a lowercased channel id
							channelRoomKey(params.channel.replace("adh", "ADH")),
							createSystemMessage(params.message),
						)
					}
				},
			})
		},
		[account, addMessage, identity, join],
	)

	useSocketListener(jotaiUtils.useAtomCallback(handler))
}
