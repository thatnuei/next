import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { raise } from "../common/raise"
import { useEffectRef } from "../react/useEffectRef"

interface ToastCardProps {
	children: ReactNode
	duration: number
	onDismissed?: () => void
}

type ToastStatus = "visible" | "dismissed"

const transitionDuration = 150

const keyframes = [
	{ opacity: 0, transform: "scale(0.9)" },
	{ opacity: 1, transform: "scale(1)" },
]

export default function NotificationToast({
	children,
	duration,
	onDismissed,
}: ToastCardProps) {
	const ref = useRef<HTMLDivElement>(null)
	const getRef = () => ref.current ?? raise("Ref not applied")

	const [status, setStatus] = useState<ToastStatus>("visible")

	const onDismissedRef = useEffectRef(onDismissed)

	useEffect(() => {
		if (status === "visible") {
			const element = getRef()

			const animation = element.animate(keyframes, {
				duration: transitionDuration,
				easing: "ease-out",
				fill: "forwards",
			})

			const timeout = setTimeout(() => setStatus("dismissed"), duration)

			return () => {
				animation.cancel()
				clearTimeout(timeout)
			}
		}

		if (status === "dismissed") {
			const element = getRef()

			const animation = element.animate(keyframes, {
				duration: transitionDuration,
				easing: "ease-out",
				direction: "reverse",
				fill: "forwards",
			})

			animation.onfinish = () => {
				onDismissedRef.current?.()
			}

			return () => {
				animation.cancel()
			}
		}
	}, [duration, onDismissedRef, status])

	// const handleClick = () => {
	// 	if (status === "visible") {
	// 		setStatus("dismissed")
	// 		onClick?.()
	// 	}
	// }

	return (
		<div ref={ref} className="max-w-lg shadow bg-midnight-0">
			{children}
		</div>
	)
}
