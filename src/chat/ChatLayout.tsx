import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { range } from "../helpers/range"
import { MenuIcon, MoreIcon } from "../ui/icons"
import { Chatbox } from "./Chatbox"

export default function ChatLayout() {
	const [menu, setMenu] = useState(false)

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
					onClick={() => setMenu(true)}
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

			<AnimatePresence>
				{menu && (
					<motion.div
						className="fixed inset-0 bg-black bg-opacity-50"
						onClick={(e) => {
							if (e.target === e.currentTarget) setMenu(false)
						}}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
					>
						<motion.div
							className="fixed inset-y-0 right-0"
							initial={{ translateX: 100 }}
							animate={{ translateX: 0 }}
							exit={{ translateX: 100 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<section className="w-64 h-full bg-midnight-0">nani</section>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	)
}
