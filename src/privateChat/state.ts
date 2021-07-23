import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import { omit } from "../common/omit"
import { raise } from "../common/raise"
import type { Dict, TruthyMap } from "../common/types"
import { dictionaryAtomFamily } from "../jotai/dictionaryAtomFamily"
import { useUpdateAtomFn } from "../jotai/useUpdateAtomFn"
import { useUpdateDictAtom } from "../jotai/useUpdateDictAtom"
import { useChatLogger } from "../logging/context"
import type { MessageState } from "../message/MessageState"
import {
	createPrivateMessage,
	createSystemMessage,
} from "../message/MessageState"
import type { RoomState } from "../room/state"
import { addRoomMessage, createRoomState, setRoomUnread } from "../room/state"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { useIdentity } from "../user"
import { restorePrivateChats, savePrivateChats } from "./storage"
import type { TypingStatus } from "./types"

interface PrivateChat extends RoomState {
	readonly partnerName: string
	readonly typingStatus: TypingStatus
	readonly previousMessages: readonly MessageState[]
}

const privateChatDictAtom = atom<Dict<PrivateChat>>({})

const privateChatAtom = dictionaryAtomFamily(
	privateChatDictAtom,
	createPrivateChat,
)

const openChatNamesAtom = atom<TruthyMap>({})

function createPrivateChat(partnerName: string): PrivateChat {
	return {
		...createRoomState(),
		partnerName,
		typingStatus: "clear",
		previousMessages: [],
	}
}

function getLoggerRoomId(identity: string, partnerName: string): string {
	return `private-chat:${identity}:${partnerName}`
}

function useAddPrivateChatMessage() {
	const updatePrivateChatDict = useUpdateDictAtom(
		privateChatDictAtom,
		createPrivateChat,
	)
	const logger = useChatLogger()
	const identity = useIdentity()

	return useCallback(
		(partnerName: string, message: MessageState) => {
			updatePrivateChatDict(partnerName, (chat) =>
				addRoomMessage(chat, message),
			)
			if (identity) {
				logger.addMessage(getLoggerRoomId(identity, partnerName), message)
			}
		},
		[identity, logger, updatePrivateChatDict],
	)
}

function useOpenPrivateChat() {
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const updatePrivateChatDict = useUpdateDictAtom(
		privateChatDictAtom,
		createPrivateChat,
	)
	const logger = useChatLogger()
	const identity = useIdentity()

	return useCallback(
		(partnerName: string) => {
			setOpenChatNames((names) => ({ ...names, [partnerName]: true }))

			if (identity) {
				logger.setRoomName(
					getLoggerRoomId(identity, partnerName),
					`${partnerName} (on ${identity})`,
				)

				logger
					.getMessages(getLoggerRoomId(identity, partnerName), 30)
					.then((messages) => {
						updatePrivateChatDict(partnerName, (chat) => ({
							...chat,
							previousMessages: messages,
						}))
					})
			}
		},
		[identity, logger, setOpenChatNames, updatePrivateChatDict],
	)
}

export function useOpenChatNames() {
	const openChatNames = useAtomValue(openChatNamesAtom)
	return useMemo(() => Object.keys(openChatNames), [openChatNames])
}

export function usePrivateChat(partnerName: string): PrivateChat {
	return useAtomValue(privateChatAtom(partnerName))
}

export function usePrivateChatActions(partnerName: string) {
	const { send } = useSocketActions()
	const identity = useIdentity() ?? raise("not logged in")
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const setPrivateChat = useUpdateAtom(privateChatAtom(partnerName))
	const addPrivateChatMessage = useAddPrivateChatMessage()
	const openPrivateChat = useOpenPrivateChat()

	return useMemo(
		() => ({
			open() {
				openPrivateChat(partnerName)
			},
			close() {
				setOpenChatNames((prev) => omit(prev, [partnerName]))
			},
			sendMessage(message: string) {
				if (!identity) return

				const rollPrefix = "/roll"
				if (message.startsWith(rollPrefix)) {
					send({
						type: "RLL",
						params: {
							recipient: partnerName,
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
							recipient: partnerName,
							dice: "bottle",
						},
					})
					return
				}

				send({
					type: "PRI",
					params: {
						recipient: partnerName,
						message,
					},
				})

				addPrivateChatMessage(
					partnerName,
					createPrivateMessage(identity, message),
				)
			},
			setInput(input: string) {
				setPrivateChat((chat) => ({ ...chat, input }))
			},
			markRead() {
				setPrivateChat((chat) => setRoomUnread(chat, false))
			},
		}),
		[
			openPrivateChat,
			partnerName,
			setOpenChatNames,
			identity,
			send,
			addPrivateChatMessage,
			setPrivateChat,
		],
	)
}

export function usePrivateChatCommandHandler() {
	const identity = useIdentity()
	const updateAtom = useUpdateAtomFn()
	const addPrivateChatMessage = useAddPrivateChatMessage()
	const openPrivateChat = useOpenPrivateChat()
	const partnerNames = useAtomValue(openChatNamesAtom)
	const setPrivateChatDict = useUpdateAtom(privateChatDictAtom)
	const [isRestored, setIsRestored] = useState(false)

	useEffect(() => {
		if (!isRestored || !identity) return
		savePrivateChats(identity, Object.keys(partnerNames))
	}, [identity, partnerNames, isRestored])

	useSocketListener((command) => {
		matchCommand(command, {
			async IDN() {
				setPrivateChatDict({})

				if (!identity) return
				const names = await restorePrivateChats(identity).catch(() => [])
				for (const name of names) {
					openPrivateChat(name)
				}
				setIsRestored(true)
			},

			PRI({ character, message }) {
				openPrivateChat(character)
				addPrivateChatMessage(
					character,
					createPrivateMessage(character, message),
				)
				updateAtom(privateChatAtom(character), (chat) =>
					setRoomUnread(chat, true),
				)
			},

			TPN({ character, status }) {
				updateAtom(privateChatAtom(character), (prev) => ({
					...prev,
					typingStatus: status,
				}))
			},

			RLL(params) {
				if ("recipient" in params) {
					const partnerName =
						params.character === identity ? params.recipient : params.character

					openPrivateChat(partnerName)
					addPrivateChatMessage(
						partnerName,
						createSystemMessage(params.message),
					)
				}
			},
		})
	})
}
