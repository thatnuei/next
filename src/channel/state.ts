import { atom, useAtom } from "jotai"
import { selectAtom, useAtomValue, useUpdateAtom } from "jotai/utils"
import { mapValues } from "lodash-es"
import { useCallback, useEffect, useMemo } from "react"
import { characterAtom } from "../character/state"
import type { Character } from "../character/types"
import { omit } from "../common/omit"
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
import { loadChannels, saveChannels } from "./storage"
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
	readonly previousMessages: readonly MessageState[]
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
		previousMessages: [],
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

export function useJoinChannel() {
	const { send } = useSocketActions()
	const updateAtom = useUpdateAtomFn()

	return useCallback(
		(id: string, title?: string) => {
			send({
				type: "JCH",
				params: { channel: id },
			})
			updateAtom(channelAtom(id), (channel) => ({
				...channel,
				joinState: "joining",
				title: title || channel.title,
			}))
		},
		[send, updateAtom],
	)
}

export function useChannelActions(id: string) {
	const { send } = useSocketActions()
	const identity = useIdentity()
	const logger = useChatLogger()
	const updateChannel = useUpdateAtom(channelAtom(id))
	const joinChannel = useJoinChannel()

	const join = useCallback(
		(title?: string) => joinChannel(id, title),
		[id, joinChannel],
	)

	const leave = useCallback(() => {
		send({ type: "LCH", params: { channel: id } })
		updateChannel((channel) => ({ ...channel, joinState: "leaving" }))
	}, [id, send, updateChannel])

	const addMessage = useCallback(
		(message: MessageState) => {
			updateChannel((channel) => addRoomMessage(channel, message))
			logger.addMessage(`channel:${id}`, message)
		},
		[id, logger, updateChannel],
	)

	const clearMessages = useCallback(() => {
		updateChannel(clearRoomMessages)
	}, [updateChannel])

	const sendMessage = useCallback(
		(message: string) => {
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
			addMessage(createChannelMessage(identity, message))
		},
		[addMessage, id, identity, send],
	)

	const setSelectedMode = useCallback(
		(selectedMode: ChannelMode) => {
			updateChannel((channel) => ({ ...channel, selectedMode }))
		},
		[updateChannel],
	)

	const setInput = useCallback(
		(input: string) => {
			updateChannel((channel) => ({ ...channel, input }))
		},
		[updateChannel],
	)

	return {
		join,
		leave,
		sendMessage,
		updateChannel,
		addMessage,
		clearMessages,
		setSelectedMode,
		setInput,
	}
}

export function useChannelCommandListener() {
	const identity = useIdentity()
	const account = useAccount()
	const logger = useChatLogger()
	const [channelDict, updateChannelDict] = useAtom(channelDictAtom)
	const updateAtom = useUpdateAtomFn()
	const joinChannel = useJoinChannel()

	useEffect(() => {
		if (!account || !identity) return

		const channels = Object.values(channelDict)
			.filter(isChannelJoined)
			.map((ch) => ch.id)

		saveChannels(channels, account, identity)
	}, [account, channelDict, identity])

	useSocketListener((command: ServerCommand) => {
		matchCommand(command, {
			async IDN() {
				if (account && identity) {
					const channelIds = await loadChannels(account, identity)
					for (const id of channelIds) {
						joinChannel(id)
					}
				}
			},

			JCH({ channel: id, character: { identity: name }, title }) {
				updateAtom(channelAtom(id), (channel) => ({
					...channel,
					title,
					users: { ...channel.users, [name]: true },
					joinState: "joined",
				}))

				logger.setRoomName(`channel:${id}`, title)

				if (name === identity) {
					logger.getMessages(`channel:${id}`, 30).then((messages) => {
						updateAtom(channelAtom(id), (channel) => ({
							...channel,
							previousMessages: messages,
						}))
					})
				}
			},

			LCH({ channel: id, character }) {
				updateAtom(channelAtom(id), (channel) => ({
					...channel,
					joinState: character === identity ? "left" : channel.joinState,
					users: omit(channel.users, [character]),
				}))
			},

			FLN({ character }) {
				updateChannelDict((channels) =>
					mapValues(channels, (channel) => ({
						...channel,
						users: omit(channel.users, [character]),
					})),
				)
			},

			ICH({ channel: id, users, mode }) {
				updateAtom(channelAtom(id), (channel) => ({
					...channel,
					mode,
					users: truthyMap(users.map((user) => user.identity)),
				}))
			},

			CDS({ channel: id, description }) {
				updateAtom(channelAtom(id), (channel) => ({
					...channel,
					description,
				}))
			},

			COL({ channel: id, oplist }) {
				updateAtom(channelAtom(id), (channel) => ({
					...channel,
					ops: truthyMap(oplist),
				}))
			},

			MSG({ channel: id, message, character }) {
				updateAtom(channelAtom(id), (channel) =>
					addRoomMessage(channel, createChannelMessage(character, message)),
				)
			},

			LRP({ channel: id, character, message }) {
				updateAtom(channelAtom(id), (channel) =>
					addRoomMessage(channel, createAdMessage(character, message)),
				)
			},

			RLL(params) {
				if ("channel" in params) {
					// bottle messages have a lowercased channel id
					const id = params.channel.replace("adh", "ADH")
					updateAtom(channelAtom(id), (channel) =>
						addRoomMessage(channel, createSystemMessage(params.message)),
					)
				}
			},
		})
	})
}
