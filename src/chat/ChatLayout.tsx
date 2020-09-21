import React from "react"
import { range } from "../helpers/range"
import Button from "../ui/Button"
import { MenuIcon, MoreIcon } from "../ui/icons"
import SideDrawer, { useSideDrawer } from "../ui/SideDrawer"
import { Chatbox } from "./Chatbox"

export default function ChatLayout() {
	const menu = useSideDrawer()

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

			<ul className="flex-1 min-h-0 space-y-1 overflow-y-auto" tabIndex={0}>
				{[...range(0, 10)].map((n) => (
					<li key={n} className={`bg-midnight-1`}>
						<div
							className={`px-3 py-1 ${
								Math.random() > 0.5 ? "" : "bg-green-500 bg-opacity-25"
							}`}
						>
							<strong className="inline-block mr-3 font-medium">someone</strong>
							<span>
								Adipisicing ut sint laborum dolore amet irure proident sunt
								culpa tempor sunt commodo. Consequat duis occaecat nostrud
								mollit quis nisi labore. Adipisicing occaecat sit velit et. Ea
								nisi excepteur ullamco pariatur incididunt sint sit veniam do
								duis labore est. Veniam ipsum labore amet pariatur sit elit. In
								sint reprehenderit laborum do nulla aliquip elit commodo velit
								amet elit dolor.
							</span>
						</div>
					</li>
				))}
			</ul>

			<Chatbox onSubmit={console.log} />

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
