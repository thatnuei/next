import { Transition, TransitionClasses } from "@headlessui/react"
import { ReactNode } from "react"

export default function FadeRiseTransition({
	isVisible,
	children,
	className,
	...props
}: {
	isVisible: boolean
	children: ReactNode
	className?: string
} & TransitionClasses) {
	const inClass = `translate-y-0 opacity-100`
	const outClass = `translate-y-8 opacity-0`

	return (
		<Transition
			show={isVisible}
			className={`${`transition transform duration-300`} ${className}`}
			enterFrom={outClass}
			enterTo={inClass}
			leaveFrom={inClass}
			leaveTo={outClass}
			{...props}
		>
			{children}
		</Transition>
	)
}
