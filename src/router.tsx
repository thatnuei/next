import { createRouter, defineRoute, param } from "type-route"

export type ChatRoute = ReturnType<typeof useRoute>

export const { RouteProvider, useRoute, routes } = createRouter({
	channel: defineRoute(
		{ channelId: param.path.string },
		(p) => `/channel/${p.channelId}`,
	),
	privateChat: defineRoute(
		{ partnerName: param.path.string },
		(p) => `/private-chat/${p.partnerName}`,
	),
	notifications: defineRoute(
		{ notificationId: param.query.optional.string },
		() => `/notifications`,
	),
	logs: defineRoute("/logs"),
})
