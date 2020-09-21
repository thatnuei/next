import { useState } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import { range } from "../helpers/range"
import Button from "../ui/Button"
import { MenuIcon, MoreIcon } from "../ui/icons"

export default function ChatLayout() {
	return (
		<main className="absolute inset-0 flex flex-col">
			<section className="flex items-center px-3 py-2 space-x-3 bg-midnight-0">
				<button
					type="button"
					className="transition-opacity duration-300 opacity-50 active:opacity-100 active:transition-none"
					aria-label="Menu"
				>
					<MenuIcon className="size-5" />
				</button>

				<h1 className="flex-1 min-w-0 text-2xl font-header ellipsize">
					Frontpage
				</h1>

				<button
					type="button"
					className="transition-opacity duration-300 opacity-50 active:opacity-100 active:transition-none"
					aria-label="More"
				>
					<MoreIcon className="size-5" />
				</button>
			</section>

			<ul
				className="flex-1 min-h-0 px-3 py-2 space-y-2 overflow-y-auto"
				tabIndex={0}
			>
				{[...range(0, 10)].map((n) => (
					<li key={n}>
						<strong className="inline-block mr-3 font-medium">someone</strong>
						<span>
							Adipisicing ut sint laborum dolore amet irure proident sunt culpa
							tempor sunt commodo. Consequat duis occaecat nostrud mollit quis
							nisi labore. Adipisicing occaecat sit velit et. Ea nisi excepteur
							ullamco pariatur incididunt sint sit veniam do duis labore est.
							Veniam ipsum labore amet pariatur sit elit. In sint reprehenderit
							laborum do nulla aliquip elit commodo velit amet elit dolor.
						</span>
					</li>
				))}
			</ul>

			<Chatbox onSubmit={console.log} />
		</main>
	)
}

function Chatbox(props: { onSubmit: (message: string) => void }) {
	const [rawValue, setRawValue] = useState("")
	const value = rawValue.trim()

	function submit() {
		if (value) {
			props.onSubmit(value)
			setRawValue("")
		}
	}

	return (
		<form
			className="flex p-2 space-x-2 bg-midnight-0"
			onSubmit={(e) => {
				e.preventDefault()
				submit()
			}}
		>
			<ExpandingTextArea
				value={rawValue}
				onChange={(e) => setRawValue(e.currentTarget.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
						submit()
						e.preventDefault()
					}
				}}
				className="flex-1 resize-none input-solid"
				placeholder="Say something..."
				aria-label="Message"
			/>
			<Button type="submit" className="px-4 button-solid">
				Send
			</Button>
		</form>
	)
}
