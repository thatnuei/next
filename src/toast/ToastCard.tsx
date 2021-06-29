import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { raise } from "../common/raise"
import { useEffectRef } from "../react/useEffectRef"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import type { ToastOptions } from "./state"

interface ToastCardProps extends ToastOptions {
	onDismissed?: () => void
}

type ToastStatus = "visible" | "dismissed"

const transitionDuration = 150

const keyframes = [
	{ opacity: 0, transform: "scale(0.9)" },
	{ opacity: 1, transform: "scale(1)" },
]

export default function ToastCard({
	type,
	duration,
	content,
	onDismissed,
	onClick,
}: ToastCardProps) {
	const ref = useRef<HTMLButtonElement>(null)
	const onDismissedRef = useEffectRef(onDismissed)
	const [status, setStatus] = useState<ToastStatus>("visible")

	useEffect(() => {
		if (status === "visible") {
			const element = ref.current ?? raise("ref not applied")

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
			const element = ref.current ?? raise("ref not applied")

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

	const handleClick = () => {
		if (status === "visible") {
			setStatus("dismissed")
			onClick?.()
		}
	}

	const typeInfo = {
		info: {
			className: clsx`bg-midnight-0 hover:bg-midnight-1`,
			icon: icons.about,
		},
		success: {
			className: clsx`bg-green-700 hover:bg-green-800`,
			icon: icons.check,
		},
		warning: {
			className: clsx`bg-yellow-600 hover:bg-yellow-700`,
			icon: icons.warning,
		},
		error: {
			className: clsx`bg-red-800 hover:bg-red-900`,
			icon: icons.close,
		},
	}[type]

	return (
		<button
			className={clsx(
				`flex w-64 gap-1 p-2 text-white rounded shadow-lg transition-colors`,
				typeInfo.className,
				status !== "visible" && `pointer-events-none`,
			)}
			ref={ref}
			onClick={handleClick}
		>
			<Icon which={typeInfo.icon} />
			<span className="self-center flex-1" role="alert">
				{content}
			</span>
		</button>
	)
}
