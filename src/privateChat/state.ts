import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useCallback, useMemo } from "react"
import { omit } from "../common/omit"
import { raise } from "../common/raise"
import { truthyMap } from "../common/truthyMap"
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
import { addRoomMessage, createRoomState } from "../room/state"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { useIdentity } from "../user"
import { restorePrivateChats } from "./storage"
import type { TypingStatus } from "./types"

interface PrivateChat extends RoomState {
	readonly partnerName: string
	readonly typingStatus: TypingStatus
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
	}
}

export function useOpenChatNames() {
	const openChatNames = useAtomValue(openChatNamesAtom)
	return useMemo(() => Object.keys(openChatNames), [openChatNames])
}

export function usePrivateChat(partnerName: string): PrivateChat {
	return useAtomValue(privateChatAtom(partnerName))
}

export function useAddPrivateChatMessage() {
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
				logger.addMessage(`private-chat:${identity}:${partnerName}`, message)
			}
		},
		[identity, logger, updatePrivateChatDict],
	)
}

export function usePrivateChatActions(partnerName: string) {
	const { send } = useSocketActions()
	const identity = useIdentity() ?? raise("not logged in")
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const setPrivateChat = useUpdateAtom(privateChatAtom(partnerName))
	const addPrivateChatMessage = useAddPrivateChatMessage()

	return useMemo(
		() => ({
			open() {
				setOpenChatNames((prev) => ({ ...prev, [partnerName]: true }))
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
		}),
		[
			setOpenChatNames,
			partnerName,
			identity,
			send,
			addPrivateChatMessage,
			setPrivateChat,
		],
	)
}

export function usePrivateChatCommandHandler() {
	const identity = useIdentity()
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const updateAtom = useUpdateAtomFn()
	const addPrivateChatMessage = useAddPrivateChatMessage()

	useSocketListener((command) => {
		matchCommand(command, {
			async IDN() {
				if (!identity) return
				const names = await restorePrivateChats(identity).catch(() => [])
				setOpenChatNames(truthyMap(names))
			},

			PRI({ character, message }) {
				setOpenChatNames((prev) => ({ ...prev, [character]: true }))
				addPrivateChatMessage(
					character,
					createPrivateMessage(character, message),
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

					setOpenChatNames((prev) => ({ ...prev, [partnerName]: true }))
					addPrivateChatMessage(
						partnerName,
						createSystemMessage(params.message),
					)
				}
			},
		})
	})
}
