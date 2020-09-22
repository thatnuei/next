import React, { useState } from "react"
import { ChannelMessage } from "../channel/types"
import Button from "../ui/Button"
import { MenuIcon, MoreIcon } from "../ui/icons"
import SideDrawer, { useSideDrawer } from "../ui/SideDrawer"
import { Chatbox } from "./Chatbox"
import MessageList from "./MessageList"

export default function ChatLayout() {
	const menu = useSideDrawer()
	const [messages, setMessages] = useState<ChannelMessage[]>([
		{
			id: "1",
			text:
				"Reprehenderit laborum magna occaecat deserunt nisi nostrud ut duis mollit dolor ullamco dolore sit velit. Dolore ut culpa in consequat sunt aliqua commodo sunt amet commodo aliqua. Exercitation quis proident do ullamco deserunt. Amet tempor laborum adipisicing duis nulla proident.",
			time: Date.now(),
			type: "normal",
			senderName: "someone",
		},
		{
			id: "2",
			text:
				"Reprehenderit laborum magna occaecat deserunt nisi nostrud ut duis mollit dolor ullamco dolore sit velit. Dolore ut culpa in consequat sunt aliqua commodo sunt amet commodo aliqua. Exercitation quis proident do ullamco deserunt. Amet tempor laborum adipisicing duis nulla proident.",
			time: Date.now(),
			type: "ad",
			senderName: "someone",
		},
		{
			id: "3",
			text:
				"Reprehenderit laborum magna occaecat deserunt nisi nostrud ut duis mollit dolor ullamco dolore sit velit. Dolore ut culpa in consequat sunt aliqua commodo sunt amet commodo aliqua. Exercitation quis proident do ullamco deserunt. Amet tempor laborum adipisicing duis nulla proident.",
			time: Date.now(),
			type: "admin",
			senderName: "someone",
		},
		{
			id: "4",
			text:
				"Reprehenderit laborum magna occaecat deserunt nisi nostrud ut duis mollit dolor ullamco dolore sit velit. Dolore ut culpa in consequat sunt aliqua commodo sunt amet commodo aliqua. Exercitation quis proident do ullamco deserunt. Amet tempor laborum adipisicing duis nulla proident.",
			time: Date.now(),
			type: "system",
			senderName: "someone",
		},
	])

	return (
		<main className="absolute inset-0 flex flex-col">
			<section className="flex items-center px-3 py-2 space-x-3 bg-midnight-0">
				<button
					type="button"
					className="transition-opacity duration-300 opacity-50 active:opacity-100 active:transition-none"
					title="Menu"
				>
					<MenuIcon className="size-5" />
				</button>

				<h1 className="flex-1 min-w-0 text-2xl font-header ellipsize">
					Frontpage
				</h1>

				<button
					type="button"
					className="transition-opacity duration-300 opacity-50 active:opacity-100 active:transition-none"
					title="More"
					onClick={menu.show}
				>
					<MoreIcon className="size-5" />
				</button>
			</section>

			<section className="flex-1 min-h-0">
				<MessageList messages={messages} />
			</section>

			<Chatbox
				onSubmit={(text) =>
					setMessages((messages) => [
						...messages,
						{
							id: String(Math.random()),
							text,
							time: Date.now(),
							type: "normal",
							senderName: "someone",
						},
					])
				}
			/>

			<SideDrawer {...menu.props}>
				<section className="w-64 h-full bg-midnight-0">
					<Button>test</Button>
					<Button>test</Button>
					<Button>test</Button>
				</section>
			</SideDrawer>
		</main>
	)
}
