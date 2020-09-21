import { range } from "../helpers/range"
import { MenuIcon, MoreIcon } from "../ui/icons"
import { Chatbox } from "./Chatbox"

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
