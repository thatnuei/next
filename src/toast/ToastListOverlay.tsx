import { AnimatePresence, motion } from "framer-motion"
import Button from "../ui/Button"
import { alertIcon } from "../ui/icons"
import { useToastStoreActions, useToastStoreState } from "./context"

export default function ToastListOverlay() {
	const toasts = useToastStoreState()
	const { remove } = useToastStoreActions()

	return (
		<div className="fixed inset-x-0 top-0 flex flex-col items-center max-h-screen p-4 space-y-4 overflow-y-auto">
			<AnimatePresence>
				{toasts.map((toast) => (
					<motion.div
						key={toast.key}
						role="alert"
						aria-label={`${toast.text} - Click to dismiss`}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.25, ease: "circOut" }}
						layout
					>
						<Button
							className="flex items-start max-w-md p-2 text-left text-white bg-red-800 shadow"
							onClick={() => remove(toast.key)}
							onKeyDown={(event) => {
								if (event.key === "Escape") {
									remove(toast.key)
								}
							}}
						>
							<div>{alertIcon}</div>
							<div className="ml-2 space-y-1">
								<p className="leading-snug">{toast.text}</p>
								<p className="text-xs opacity-75">Click to dismiss</p>
							</div>
						</Button>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}
