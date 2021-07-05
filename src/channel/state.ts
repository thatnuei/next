import { useCallback } from "react"
import {
	atom,
	atomFamily,
	selector,
	selectorFamily,
	useRecoilCallback,
	useRecoilValue,
} from "recoil"
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
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions } from "../socket/SocketConnection"
import { loadChannels, saveChannels } from "./storage"
import type { ChannelMode } from "./types"

const maxMessageCount = 500

export interface Channel {
	id: string
	title: string
	description: string
	mode: ChannelMode
	selectedMode: ChannelMode
	users: TruthyMap
	ops: TruthyMap
	isUnread: boolean
	chatInput: string
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

const channelAtom = atomFamily({
	key: "channel",
	default: createChannel,
})

// todo: represent join states instead of just booleans (?)
const joinedChannelIdsAtom = atom<TruthyMap>({
	key: "joinedChannelIds",
	default: {},
})

const joinedChannelsSelector = selector({
	key: "joinedChannels",
	get: ({ get }) => {
		const joinedChannelIds = get(joinedChannelIdsAtom)
		return Object.keys(joinedChannelIds).map((id) => get(channelAtom(id)))
	},
})

const isChannelJoinedSelector = selectorFamily({
	key: "isChannelJoined",
	get:
		(id: string) =>
		({ get }) =>
			get(joinedChannelIdsAtom)[id] ?? false,
})

const channelMessages = atomFamily({
	key: "channelMessages",
	default: (channelId: string): readonly MessageState[] => [],
})

const channelCharacters = selectorFamily({
	key: "channelCharacters",
	get:
		(channelId: string) =>
		({ get }): readonly Character[] => {
			const users = get(channelAtom(channelId)).users
			const characters = get(charactersAtom)
			return Object.keys(users)
				.map((name) => characters[name])
				.filter(isPresent)
		},
})

export function useChannel(id: string) {
	return useRecoilValue(channelAtom(id))
}

export function useJoinedChannelIds() {
	return useRecoilValue(joinedChannelIdsAtom)
}

export function useJoinedChannels() {
	return useRecoilValue(joinedChannelsSelector)
}

export function useIsChannelJoined(id: string) {
	return useRecoilValue(isChannelJoinedSelector(id))
}

export function useChannelMessages(id: string) {
	return useRecoilValue(channelMessages(id))
}

export function useChannelCharacters(id: string) {
	return useRecoilValue(channelCharacters(id))
}

export function useActualChannelMode(id: string) {
	const channel = useChannel(id)
	return channel.mode === "both" ? channel.selectedMode : channel.mode
}

export function useChannelActions() {
	const { send } = useSocketActions()

	const updateChannel = useRecoilCallback(
		({ set }) =>
			(id: string, properties: Partial<Channel>) => {
				set(channelAtom(id), (prev) => ({ ...prev, ...properties }))
			},
	)

	const join = useCallback(
		(id: string, title?: string) => {
			send({
				type: "JCH",
				params: { channel: id },
			})

			if (title) {
				updateChannel(id, { title })
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
		(id: string, message: string) => {
			send({
				type: "MSG",
				params: {
					channel: id,
					message,
				},
			})
		},
		[send],
	)

	const clearMessages = useRecoilCallback(
		({ set }) =>
			(id: string) =>
				set(channelMessages(id), []),
		[],
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
	const joinedChannelIds = useRecoilValue(joinedChannelIdsAtom)

	return useRecoilCallback(({ set }) => (command: ServerCommand) => {
		function addMessage(id: string, message: MessageState) {
			// we don't want to keep too many messages in memory
			// logs should make up for this
			set(channelMessages(id), (prev) =>
				[...prev, message].slice(-maxMessageCount),
			)
		}

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
					Object.entries(joinedChannelIds)
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
					Object.entries(joinedChannelIds)
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
				addMessage(id, createChannelMessage(character, message))
			},

			LRP({ channel: id, character, message }) {
				addMessage(id, createAdMessage(character, message))
			},

			RLL(params) {
				if ("channel" in params) {
					addMessage(params.channel, createSystemMessage(params.message))
				}
			},
		})
	})
}
