import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"
import { useMemo } from "react"
import { omit } from "../common/omit"
import { raise } from "../common/raise"
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
import { restorePrivateChats } from "./storage"
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

export function usePrivateChatActions(partnerName: string) {
	const { send } = useSocketActions()
	const identity = useIdentity() ?? raise("not logged in")
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const setPrivateChat = useUpdateAtom(privateChatAtom(partnerName))

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

				setPrivateChat((prev) =>
					addRoomMessage(prev, createPrivateMessage(identity, message)),
				)
			},
			setInput(input: string) {
				setPrivateChat((chat) => ({ ...chat, input }))
			},
		}),
		[setOpenChatNames, partnerName, identity, send, setPrivateChat],
	)
}

export function usePrivateChatCommandHandler() {
	const identity = useIdentity()
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const updateAtom = useUpdateAtomFn()

	useSocketListener((command) => {
		matchCommand(command, {
			async IDN() {
				if (!identity) return
				const names = await restorePrivateChats(identity).catch(() => [])
				setOpenChatNames(truthyMap(names))
			},

			PRI({ character, message }) {
				setOpenChatNames((prev) => ({ ...prev, [character]: true }))
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

					setOpenChatNames((prev) => ({ ...prev, [partnerName]: true }))

					updateAtom(privateChatAtom(partnerName), (prev) =>
						addRoomMessage(prev, createSystemMessage(params.message)),
					)
				}
			},
		})
	})
}
