import { useCallback } from "react"
import {
	atom,
	selectorFamily,
	useRecoilCallback,
	useRecoilValue,
	useSetRecoilState,
} from "recoil"
import { delay } from "../common/delay"
import type { ServerCommand } from "../socket/helpers"
import { matchCommand } from "../socket/helpers"
import { useSocketActions } from "../socket/SocketConnection"

export interface ChannelBrowserChannel {
	id: string
	title: string
	type: "public" | "private"
	userCount: number
}

const publicChannelsAtom = atom<ChannelBrowserChannel[]>({
	key: "channelBrowser:publicChannels",
	default: [],
})

const privateChannelsAtom = atom<ChannelBrowserChannel[]>({
	key: "channelBrowser:privateChannels",
	default: [],
})

const isRefreshingAtom = atom({
	key: "channelBrowser:isRefreshing",
	default: false,
})

const isPublicSelector = selectorFamily({
	key: "channelBrowser:isPublic",
	get:
		(channelId: string) =>
		({ get }): boolean =>
			get(publicChannelsAtom).some((ch) => ch.id === channelId),
})

const userCountSelector = selectorFamily({
	key: "channelBrowser:userCount",
	get:
		(channelId: string) =>
		({ get }): number => {
			const channels = [...get(publicChannelsAtom), ...get(privateChannelsAtom)]
			return channels.find((ch) => ch.id === channelId)?.userCount ?? 0
		},
})

export function useChannelBrowserCommandHandler() {
	const setPublicChannels = useSetRecoilState(publicChannelsAtom)
	const setPrivateChannels = useSetRecoilState(privateChannelsAtom)

	return useCallback(
		(command: ServerCommand) => {
			matchCommand(command, {
				CHA({ channels }) {
					setPublicChannels(
						channels.map((it) => ({
							id: it.name,
							title: it.name,
							userCount: it.characters,
							type: "public",
						})),
					)
				},
				ORS({ channels }) {
					setPrivateChannels(
						channels.map((it) => ({
							id: it.name,
							title: it.title,
							userCount: it.characters,
							type: "private",
						})),
					)
				},
			})
		},
		[setPrivateChannels, setPublicChannels],
	)
}

export function useRefreshChannelBrowser() {
	const { send } = useSocketActions()

	return useRecoilCallback(
		({ snapshot, set }) =>
			async () => {
				const isRefreshing = snapshot.getLoadable(isRefreshingAtom).valueMaybe()
				if (isRefreshing) return

				send({ type: "CHA" })
				send({ type: "ORS" })

				// the server has a 7 second timeout on refreshes
				set(isRefreshingAtom, true)
				await delay(7000)
				set(isRefreshingAtom, false)
			},
		[send],
	)
}

export function usePublicChannels() {
	return useRecoilValue(publicChannelsAtom)
}

export function usePrivateChannels() {
	return useRecoilValue(privateChannelsAtom)
}

export function useChannelBrowserIsRefreshing() {
	return useRecoilValue(isRefreshingAtom)
}

export function useIsPublicChannel(channelId: string) {
	return useRecoilValue(isPublicSelector(channelId))
}

export function useChannelUserCount(channelId: string) {
	return useRecoilValue(userCountSelector(channelId))
}
