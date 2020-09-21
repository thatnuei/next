import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useState } from "react"
import FocusLock from "react-focus-lock"
import { useWindowEvent } from "../dom/useWindowEvent"

type SideDrawerProps = {
	children: React.ReactNode
	isVisible: boolean
	onDismiss: () => void
}

export default function SideDrawer({
	children,
	isVisible,
	onDismiss,
}: SideDrawerProps) {
	useWindowEvent("keydown", (event) => {
		if (event.key === "Escape") onDismiss()
	})

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className="fixed inset-0 bg-black bg-opacity-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) onDismiss()
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<FocusLock returnFocus>
						<motion.div
							className="fixed inset-y-0 right-0 shadow"
							initial={{ opacity: 0, translateX: 100 }}
							animate={{ opacity: 1, translateX: 0 }}
							exit={{ opacity: 0, translateX: 100 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							{children}
						</motion.div>
					</FocusLock>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export function useSideDrawer() {
	const [isVisible, setVisible] = useState(false)

	return {
		isVisible,
		show: useCallback(() => setVisible(true), []),
		hide: useCallback(() => setVisible(false), []),
		props: {
			isVisible,
			onDismiss: () => setVisible(false),
		},
	}
}
