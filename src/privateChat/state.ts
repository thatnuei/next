import { atom } from "jotai"
import {
	atomFamily,
	useAtomCallback,
	useAtomValue,
	useUpdateAtom,
} from "jotai/utils"
import { useCallback, useMemo } from "react"
import { useIdentity } from "../chat/identityContext"
import { omit } from "../common/omit"
import { truthyMap } from "../common/truthyMap"
import type { TruthyMap } from "../common/types"
import type { MessageState } from "../message/MessageState"
import { createPrivateMessage } from "../message/MessageState"
import type { RoomKey } from "../room/state"
import {
	roomChatInputAtom,
	roomIsUnreadAtom,
	roomMessagesAtom,
} from "../room/state"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { restorePrivateChats } from "./storage"
import type { TypingStatus } from "./types"

export const getPrivateChatRoomKey = (partnerName: string) =>
	`privateChat:${partnerName}` as RoomKey

const openChatNamesAtom = atom<TruthyMap>({})

const privateChatTypingStatusAtom = atomFamily((partnerName: string) =>
	atom<TypingStatus>("clear"),
)

function useAddPrivateMessage() {
	return useAtomCallback(
		useCallback(
			(get, set, args: { partnerName: string; message: MessageState }) => {
				set(
					roomMessagesAtom(getPrivateChatRoomKey(args.partnerName)),
					(prev) => [...prev, args.message],
				)
			},
			[],
		),
	)
}

export function useOpenChatNames() {
	const openChatNames = useAtomValue(openChatNamesAtom)
	return useMemo(() => Object.keys(openChatNames), [openChatNames])
}

export function usePrivateChatMessages(partnerName: string) {
	return useAtomValue(roomMessagesAtom(getPrivateChatRoomKey(partnerName)))
}

export function usePrivateChatIsUnread(partnerName: string) {
	return useAtomValue(roomIsUnreadAtom(getPrivateChatRoomKey(partnerName)))
}

export function usePrivateChatTypingStatus(partnerName: string) {
	return useAtomValue(privateChatTypingStatusAtom(partnerName))
}

export function usePrivateChatInput(partnerName: string) {
	return useAtomValue(roomChatInputAtom(getPrivateChatRoomKey(partnerName)))
}

export function usePrivateChatActions() {
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const { send } = useSocketActions()
	const identity = useIdentity()
	const addPrivateMessage = useAddPrivateMessage()

	function openPrivateChat(partnerName: string) {
		setOpenChatNames((prev): TruthyMap => ({ ...prev, [partnerName]: true }))
	}

	function closePrivateChat(partnerName: string) {
		setOpenChatNames((prev): TruthyMap => omit(prev, [partnerName]))
	}

	const sendMessage = useCallback(
		(args: { partnerName: string; message: string }) => {
			send({
				type: "PRI",
				params: {
					recipient: args.partnerName,
					message: args.message,
				},
			})

			addPrivateMessage({
				partnerName: args.partnerName,
				message: createPrivateMessage(identity, args.message),
			})
		},
		[addPrivateMessage, identity, send],
	)

	const setPrivateChatIsUnread = useAtomCallback(
		useCallback(
			(get, set, args: { partnerName: string; isUnread: boolean }) => {
				set(
					roomIsUnreadAtom(getPrivateChatRoomKey(args.partnerName)),
					args.isUnread,
				)
			},
			[],
		),
	)

	const setPrivateChatInput = useAtomCallback(
		useCallback((get, set, args: { partnerName: string; input: string }) => {
			set(
				roomChatInputAtom(getPrivateChatRoomKey(args.partnerName)),
				args.input,
			)
		}, []),
	)

	return {
		openPrivateChat,
		closePrivateChat,
		sendMessage,
		addPrivateMessage,
		setPrivateChatIsUnread,
		setPrivateChatInput,
	}
}

export function usePrivateChatCommandHandler() {
	const identity = useIdentity()
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const { addPrivateMessage, openPrivateChat } = usePrivateChatActions()

	useSocketListener(
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		useAtomCallback(
			useCallback(
				(get, set, command: ServerCommand) => {
					matchCommand(command, {
						async IDN() {
							const names = await restorePrivateChats(identity).catch(() => [])
							setOpenChatNames(truthyMap(names))
						},

						PRI({ character, message }) {
							openPrivateChat(character)
							addPrivateMessage({
								partnerName: character,
								message: createPrivateMessage(character, message),
							})
						},

						TPN({ character, status }) {
							set(privateChatTypingStatusAtom(character), status)
						},
					})
				},
				[addPrivateMessage, identity, openPrivateChat, setOpenChatNames],
			),
		),
	)
}
