import { createRouter, defineRoute, param } from "type-route"

export const { RouteProvider, useRoute, routes } = createRouter({
	home: defineRoute("/"),
	channel: defineRoute(
		{ channelId: param.path.string },
		(p) => `/channel/${p.channelId}`,
	),
	privateChat: defineRoute(
		{ partnerName: param.path.string },
		(p) => `/private-chat/${p.partnerName}`,
	),
})
