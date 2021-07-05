import * as jotai from "jotai"
import * as jotaiUtils from "jotai/utils"
import { useCallback } from "react"
import { charactersAtom } from "../character/state"
import type { Character } from "../character/types"
import { useAuthUser } from "../chat/authUserContext"
import { useIdentity } from "../chat/identityContext"
import { isPresent } from "../common/isPresent"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { TruthyMap } from "../common/types"
import type { MessageState } from "../message/MessageState"
import {
	createAdMessage,
	createChannelMessage,
	createSystemMessage,
} from "../message/MessageState"
import type { RoomKey } from "../room/state"
import { roomMessagesAtom } from "../room/state"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions } from "../socket/SocketConnection"
import { loadChannels, saveChannels } from "./storage"
import type { ChannelMode } from "./types"

const maxMessageCount = 500

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
		selectedMode: "both",
		users: {},
		ops: {},
		isUnread: false,
		chatInput: "",
	}
}

const channelRoomKey = (channelId: string) => `channel:${channelId}` as RoomKey

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

export function useJoinedChannelIds() {
	return jotai.useAtom(joinedChannelIdsAtom)[0]
}

export function useJoinedChannels() {
	return jotai.useAtom(joinedChannelsAtom)[0]
}

export function useIsChannelJoined(id: string) {
	return jotai.useAtom(isChannelJoinedAtom(id))[0]
}

export function useChannelMessages(id: string) {
	return jotai.useAtom(roomMessagesAtom(channelRoomKey(id)))[0]
}

export function useChannelCharacters(id: string) {
	return jotai.useAtom(channelCharacters(id))[0]
}

export function useActualChannelMode(id: string) {
	const channel = useChannel(id)
	return channel.mode === "both" ? channel.selectedMode : channel.mode
}

function useAddMessage() {
	return jotaiUtils.useAtomCallback(
		useCallback(
			(get, set, { id, message }: { id: string; message: MessageState }) => {
				set(roomMessagesAtom(channelRoomKey(id)), (prev) =>
					[...prev, message].slice(-maxMessageCount),
				)
			},
			[],
		),
	)
}

export function useChannelActions() {
	const { send } = useSocketActions()
	const identity = useIdentity()

	const updateChannel = jotaiUtils.useAtomCallback(
		useCallback((get, set, properties: Partial<Channel> & { id: string }) => {
			set(channelAtom(properties.id), (prev) => ({ ...prev, ...properties }))
		}, []),
	)

	const addMessage = useAddMessage()

	const join = useCallback(
		(id: string, title?: string) => {
			send({
				type: "JCH",
				params: { channel: id },
			})

			if (title) {
				void updateChannel({ id, title })
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
			send({ type: "MSG", params: { channel: id, message } })

			addMessage({
				id,
				message: createChannelMessage(identity, message),
			})
		},
		[addMessage, identity, send],
	)

	const clearMessages = jotaiUtils.useAtomCallback(
		useCallback((get, set, channelId: string) => {
			set(roomMessagesAtom(channelRoomKey(channelId)), [])
		}, []),
	)

	return {
		join,
		leave,
		sendMessage,
		updateChannel,
		clearMessages,
	}
}

export function useChannelCommandHandler() {
	const identity = useIdentity()
	const { account } = useAuthUser()
	const actions = useChannelActions()
	const addMessage = useAddMessage()

	const handler = useCallback(
		(get: jotai.Getter, set: jotai.Setter, command: ServerCommand) => {
			matchCommand(command, {
				async IDN() {
					set(joinedChannelIdsAtom, {})

					const channelIds = await loadChannels(account, identity)
					for (const id of channelIds) {
						actions.join(id)
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

					saveChannels(
						Object.entries(get(joinedChannelIdsAtom))
							.filter(([, joined]) => joined)
							.map(([id]) => id),
						account,
						identity,
					)
				},

				LCH({ channel: id, character }) {
					if (character === identity) {
						set(joinedChannelIdsAtom, (prev) => omit(prev, [id]))
					}

					set(channelAtom(id), (prev) => ({
						...prev,
						users: omit(prev.users, [character]),
					}))

					saveChannels(
						Object.entries(get(joinedChannelIdsAtom))
							.filter(([, joined]) => joined)
							.map(([id]) => id),
						account,
						identity,
					)
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
					void addMessage({
						id,
						message: createChannelMessage(character, message),
					})
				},

				LRP({ channel: id, character, message }) {
					void addMessage({ id, message: createAdMessage(character, message) })
				},

				RLL(params) {
					if ("channel" in params) {
						void addMessage({
							id: params.channel,
							message: createSystemMessage(params.message),
						})
					}
				},
			})
		},
		[account, actions, addMessage, identity],
	)

	return jotaiUtils.useAtomCallback(handler)
}
