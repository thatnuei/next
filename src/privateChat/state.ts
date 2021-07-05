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
import { createPrivateMessage } from "../message/MessageState"
import { roomKey, useRoomActions } from "../room/state"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { restorePrivateChats, savePrivateChats } from "./storage"
import type { TypingStatus } from "./types"

export const getPrivateChatRoomKey = (partnerName: string) =>
	roomKey(`privateChat:${partnerName}`)

const openChatNamesAtom = atom<TruthyMap>({})

const privateChatTypingStatusAtom = atomFamily((partnerName: string) =>
	atom<TypingStatus>("clear"),
)

export function useOpenChatNames() {
	const openChatNames = useAtomValue(openChatNamesAtom)
	return useMemo(() => Object.keys(openChatNames), [openChatNames])
}

export function usePrivateChatTypingStatus(partnerName: string) {
	return useAtomValue(privateChatTypingStatusAtom(partnerName))
}

export function usePrivateChatActions() {
	const { send } = useSocketActions()
	const identity = useIdentity()
	const { addMessage } = useRoomActions()

	const setPrivateChatNames = useAtomCallback(
		useCallback(
			(get, set, getNewChats: (prev: TruthyMap) => TruthyMap) => {
				const chats = get(openChatNamesAtom)
				set(openChatNamesAtom, getNewChats(chats))
				savePrivateChats(identity, Object.keys(getNewChats(chats)))
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
			send({
				type: "PRI",
				params: {
					recipient: args.partnerName,
					message: args.message,
				},
			})

			addMessage(
				getPrivateChatRoomKey(args.partnerName),
				createPrivateMessage(identity, args.message),
			)
		},
		[addMessage, identity, send],
	)

	return {
		openPrivateChat,
		closePrivateChat,
		sendMessage,
	}
}

export function usePrivateChatCommandHandler() {
	const identity = useIdentity()
	const setOpenChatNames = useUpdateAtom(openChatNamesAtom)
	const { openPrivateChat } = usePrivateChatActions()
	const { addMessage } = useRoomActions()

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
							addMessage(
								getPrivateChatRoomKey(character),
								createPrivateMessage(character, message),
							)
						},

						TPN({ character, status }) {
							set(privateChatTypingStatusAtom(character), status)
						},
					})
				},
				[addMessage, identity, openPrivateChat, setOpenChatNames],
			),
		),
	)
}
