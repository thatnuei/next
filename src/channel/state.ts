import type { Draft } from "immer"
import { produce } from "immer"
import { atom } from "jotai"
import { selectAtom, useAtomValue, useUpdateAtom } from "jotai/utils"
import { useCallback, useMemo } from "react"
import { characterAtom } from "../character/state"
import type { Character } from "../character/types"
import { truthyMap } from "../common/truthyMap"
import type { Dict, TruthyMap } from "../common/types"
import { dictionaryAtomFamily } from "../jotai/dictionaryAtomFamily"
import { useUpdateAtomFn } from "../jotai/useUpdateAtomFn"
import { useChatLogger } from "../logging/context"
import type { MessageState } from "../message/MessageState"
import {
	createAdMessage,
	createChannelMessage,
	createSystemMessage,
} from "../message/MessageState"
import type { RoomState } from "../room/state"
import {
	addRoomMessage,
	clearRoomMessages,
	createRoomState,
} from "../room/state"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { useAccount, useIdentity } from "../user"
import { loadChannels } from "./storage"
import type { ChannelMode } from "./types"

type ChannelJoinState = "joining" | "joined" | "leaving" | "left"

export interface Channel extends RoomState {
	readonly id: string
	readonly title: string
	readonly description: string
	readonly mode: ChannelMode
	readonly selectedMode: ChannelMode
	readonly users: TruthyMap
	readonly ops: TruthyMap
	readonly joinState: ChannelJoinState
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
		joinState: "left",
		...createRoomState(),
	}
}

const channelDictAtom = atom<Dict<Channel>>({})

const channelAtom = dictionaryAtomFamily(channelDictAtom, createChannel)

const isChannelJoined = (channel: Channel) => channel.joinState !== "left"

export function useChannel(id: string): Channel {
	return useAtomValue(channelAtom(id))
}

export function useJoinedChannels(): readonly Channel[] {
	const channels = Object.values(useAtomValue(channelDictAtom))
	return useMemo(() => channels.filter(isChannelJoined), [channels])
}

export function useIsChannelJoined(id: string) {
	return useAtomValue(selectAtom(channelAtom(id), isChannelJoined))
}

export function useChannelCharacters(id: string): readonly Character[] {
	const channelUsersAtom = useMemo(() => {
		return selectAtom(channelAtom(id), (channel) => channel.users)
	}, [id])

	const channelCharactersAtom = useMemo(() => {
		return atom((get) => {
			const channelUsers = get(channelUsersAtom)
			return Object.keys(channelUsers).map((name) => get(characterAtom(name)))
		})
	}, [channelUsersAtom])

	return useAtomValue(channelCharactersAtom)
}

export function useActualChannelMode(id: string) {
	const channel = useChannel(id)
	return channel.mode === "both" ? channel.selectedMode : channel.mode
}

export function useChannelActions() {
	const { send } = useSocketActions()
	const identity = useIdentity()
	const logger = useChatLogger()
	const updateAtom = useUpdateAtomFn()

	const updateChannel = useCallback(
		(id: string, mutate: (channel: Draft<Channel>) => void) => {
			updateAtom(
				channelAtom(id),
				produce((draft) => {
					mutate(draft)
				}),
			)
		},
		[updateAtom],
	)

	const addChannelMessage = useCallback(
		(channelId: string, message: MessageState) => {
			updateAtom(channelAtom(channelId), (channel) =>
				addRoomMessage(channel, message),
			)
			logger.addMessage(`channel:${channelId}`, message)
		},
		[logger, updateAtom],
	)

	const clearChannelMessages = useCallback(
		(channelId: string) => {
			updateAtom(channelAtom(channelId), (channel) =>
				clearRoomMessages(channel),
			)
		},
		[updateAtom],
	)

	const join = useCallback(
		(id: string, title?: string) => {
			send({ type: "JCH", params: { channel: id } })

			if (title) {
				updateChannel(id, (channel) => (channel.title = title))
			}
		},
		[send, updateChannel],
	)

	const leave = useCallback(
		(id: string) => {
			send({ type: "LCH", params: { channel: id } })
		},
		[send],
	)

	const sendMessage = useCallback(
		({ id, message }: { id: string; message: string }) => {
			if (!identity) return

			const rollPrefix = "/roll"
			if (message.startsWith(rollPrefix)) {
				send({
					type: "RLL",
					params: {
						channel: id,
						dice: message.slice(rollPrefix.length).trim() || "1d20",
					},
				})
				return
			}

			const bottlePrefix = "/bottle"
			if (message.startsWith(bottlePrefix)) {
				send({
					type: "RLL",
					params: {
						channel: id,
						dice: "bottle",
					},
				})
				return
			}

			send({ type: "MSG", params: { channel: id, message } })
			addChannelMessage(id, createChannelMessage(identity, message))
		},
		[addChannelMessage, identity, send],
	)

	return {
		join,
		leave,
		sendMessage,
		updateChannel,
		addChannelMessage,
		clearChannelMessages,
	}
}

export function useChannelCommandListener() {
	const identity = useIdentity()
	const account = useAccount()
	const { join, addChannelMessage, updateChannel } = useChannelActions()
	const logger = useChatLogger()
	const updateChannelDict = useUpdateAtom(channelDictAtom)

	useSocketListener((command: ServerCommand) => {
		matchCommand(command, {
			async IDN() {
				if (account && identity) {
					const channelIds = await loadChannels(account, identity)
					for (const id of channelIds) {
						join(id)
					}
				}
			},

			JCH({ channel: id, character: { identity: name }, title }) {
				updateChannel(id, (channel) => {
					channel.title = title
					channel.users[name] = true
					if (name === identity) {
						channel.joinState = "joined"
					}
				})
				logger.setRoomName(`channel:${id}`, title)
			},

			LCH({ channel: id, character }) {
				updateChannel(id, (channel) => {
					delete channel.users[character]
					if (character === identity) {
						channel.joinState = "left"
					}
				})

				// if (account && identity) {
				// 	saveChannels(
				// 		Object.entries(get(joinedChannelIdsAtom))
				// 			.filter(([, joined]) => joined)
				// 			.map(([id]) => id),
				// 		account,
				// 		identity,
				// 	)
				// }
			},

			FLN({ character }) {
				updateChannelDict(
					produce((draft) => {
						for (const channel of Object.values(draft)) {
							delete channel.users[character]
						}
					}),
				)
			},

			ICH({ channel: id, users, mode }) {
				updateChannel(id, (channel) => {
					channel.users = truthyMap(users.map((user) => user.identity))
					channel.mode = mode
				})
			},

			CDS({ channel: id, description }) {
				updateChannel(id, (channel) => {
					channel.description = description
				})
			},

			COL({ channel: id, oplist }) {
				updateChannel(id, (channel) => {
					channel.ops = truthyMap(oplist)
				})
			},

			MSG({ channel: id, message, character }) {
				addChannelMessage(id, createChannelMessage(character, message))
			},

			LRP({ channel: id, character, message }) {
				addChannelMessage(id, createAdMessage(character, message))
			},

			RLL(params) {
				if ("channel" in params) {
					addChannelMessage(
						// bottle messages have a lowercased channel id
						params.channel.replace("adh", "ADH"),
						createSystemMessage(params.message),
					)
				}
			},
		})
	})
}
