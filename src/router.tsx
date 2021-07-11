import { createGroup, createRouter, defineRoute, param } from "type-route"

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
})

export const chatRouteGroup = createGroup([
	routes.chat,
	routes.channel,
	routes.privateChat,
	routes.notifications,
])
