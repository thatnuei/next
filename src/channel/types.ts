export type ChannelMessage = {
	id: string
	senderName?: string
	text: string
	time: number
	type: "normal" | "ad" | "admin" | "system"
}
