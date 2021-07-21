import { createGroup, createRouter, defineRoute, param } from "type-route"

export type Route = ReturnType<typeof useRoute>

const chat = defineRoute(`/chat`)

export const { RouteProvider, useRoute, routes } = createRouter({
	login: defineRoute("/"),
	characterSelect: defineRoute("/character-select"),
	chat,
	channel: chat.extend(
		{ channelId: param.path.string },
		(p) => `/channel/${p.channelId}`,
	),
	privateChat: chat.extend(
		{ partnerName: param.path.string },
		(p) => `/private-chat/${p.partnerName}`,
	),
	notifications: chat.extend(
		{ notificationId: param.query.optional.string },
		() => `/notifications`,
	),
	logs: chat.extend("/logs"),
})

export const chatRouteGroup = createGroup([
	routes.chat,
	routes.channel,
	routes.privateChat,
	routes.notifications,
	routes.logs,
])
