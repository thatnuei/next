import { Transition, TransitionClasses } from "@headlessui/react"
import { ReactNode } from "react"
import { tw } from "twind"
import { apply } from "twind/css"

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
	const inClass = tw`translate-y-0 opacity-100`
	const outClass = tw`translate-y-8 opacity-0`

	return (
		<Transition
			show={isVisible}
			className={tw`${apply`transition transform duration-300`} ${className}`}
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
