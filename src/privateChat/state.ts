import { atom } from "jotai"
import { useAtomCallback, useAtomValue, useUpdateAtom } from "jotai/utils"
import { useCallback, useMemo } from "react"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { Dict, TruthyMap } from "../common/types"
import { dictionaryAtomFamily } from "../jotai/dictionaryAtomFamily"
import { useUpdateAtomFn } from "../jotai/useUpdateAtomFn"
import {
	createPrivateMessage,
	createSystemMessage,
} from "../message/MessageState"
import type { RoomState } from "../room/state"
import { addRoomMessage } from "../room/state"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { useIdentity } from "../user"
import { restorePrivateChats, savePrivateChats } from "./storage"
import type { TypingStatus } from "./types"

interface PrivateChat extends RoomState {
	readonly partnerName: string
	readonly typingStatus: TypingStatus
}

const privateChatDictAtom = atom<Dict<PrivateChat>>({})

const privateChatAtom = dictionaryAtomFamily(
	privateChatDictAtom,
	(partnerName: string): PrivateChat => ({
		partnerName,
		input: "",
		messages: [],
		isUnread: false,
		typingStatus: "clear",
	}),
)

const openChatNamesAtom = atom<TruthyMap>({})

export function useOpenChatNames() {
	const openChatNames = useAtomValue(openChatNamesAtom)
	return useMemo(() => Object.keys(openChatNames), [openChatNames])
}

export function usePrivateChat(partnerName: string): PrivateChat {
	return useAtomValue(privateChatAtom(partnerName))
}

export function usePrivateChatActions() {
	const { send } = useSocketActions()
	const identity = useIdentity()
	const updateAtom = useUpdateAtomFn()

	const setPrivateChatNames = useAtomCallback(
		useCallback(
			(get, set, getNewChats: (prev: TruthyMap) => TruthyMap) => {
				if (identity) {
					const chats = get(openChatNamesAtom)
					set(openChatNamesAtom, getNewChats(chats))
					savePrivateChats(identity, Object.keys(getNewChats(chats)))
				}
			},
			[identity],
		),
	)

	const openPrivateChat = useCallback(
		(partnerName: string) => {
			setPrivateChatNames((prev) => ({ ...prev, [partnerName]: true }))
		},
		[setPrivateChatNames],
	)

	const closePrivateChat = useCallback(
		(partnerName: string) => {
			setPrivateChatNames((prev) => omit(prev, [partnerName]))
		},
		[setPrivateChatNames],
	)

	const sendMessage = useCallback(
		(args: { partnerName: string; message: string }) => {
			if (!identity) return

			const rollPrefix = "/roll"
			if (args.message.startsWith(rollPrefix)) {
				send({
					type: "RLL",
					params: {
						recipient: args.partnerName,
						dice: args.message.slice(rollPrefix.length).trim() || "1d20",
					},
				})
				return
			}

			const bottlePrefix = "/bottle"
			if (args.message.startsWith(bottlePrefix)) {
				send({
					type: "RLL",
					params: {
						recipient: args.partnerName,
						dice: "bottle",
					},
				})
				return
			}

			send({
				type: "PRI",
				params: {
					recipient: args.partnerName,
					message: args.message,
				},
			})

			updateAtom(privateChatAtom(args.partnerName), (prev) =>
				addRoomMessage(prev, createPrivateMessage(identity, args.message)),
			)
		},
		[identity, send, updateAtom],
	)

	const setInput = useCallback(
		(partnerName: string, input: string) => {
			updateAtom(privateChatAtom(partnerName), (prev) => ({
				...prev,
				input,
			}))
		},
		[updateAtom],
	)

	return {
		openPrivateChat,
		closePrivateChat,
		sendMessage,
		setInput,
	}
}

export function usePrivateChatCommandHandler() {
	const identity = useIdentity()
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const { openPrivateChat } = usePrivateChatActions()
	const updateAtom = useUpdateAtomFn()

	useSocketListener((command) => {
		matchCommand(command, {
			async IDN() {
				if (!identity) return
				const names = await restorePrivateChats(identity).catch(() => [])
				setOpenChatNames(truthyMap(names))
			},

			PRI({ character, message }) {
				openPrivateChat(character)
				updateAtom(privateChatAtom(character), (prev) =>
					addRoomMessage(prev, createPrivateMessage(character, message)),
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

					updateAtom(privateChatAtom(partnerName), (prev) =>
						addRoomMessage(prev, createSystemMessage(params.message)),
					)
				}
			},
		})
	})
}
