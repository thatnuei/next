import { Transition, TransitionClasses } from "@headlessui/react"
import { ReactNode } from "react"

export default function FadeTransition({
	isVisible,
	children,
	delayedEntry,
	...props
}: {
	isVisible: boolean
	children: ReactNode
	delayedEntry?: boolean
	className?: string
} & TransitionClasses) {
	return (
		<Transition
			show={isVisible}
			enter={`transition-opacity ${delayedEntry && "transition-delay-300"}`}
			enterFrom={`opacity-0`}
			enterTo={`opacity-100`}
			leave={`transition-opacity`}
			leaveFrom={`opacity-100`}
			leaveTo={`opacity-0`}
			{...props}
		>
			{children}
		</Transition>
	)
}
