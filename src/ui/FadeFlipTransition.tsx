import { Transition, TransitionClasses } from "@headlessui/react"
import { ReactNode } from "react"
import { tw } from "twind"
import { apply, css } from "twind/css"

export default function FadeFlipTransition({
	isVisible,
	children,
	className,
	...props
}: {
	isVisible: boolean
	children: ReactNode
	className?: string
} & TransitionClasses) {
	const inClass = tw`opacity-100 ${css({
		transform: `perspective(800px) rotateX(0deg)`,
	})}`

	const outClass = tw`opacity-0 ${css({
		transform: `perspective(800px) rotateX(-30deg)`,
	})}`

	return (
		<Transition
			show={isVisible}
			className={tw`${apply`transition-all`} ${css({
				transformOrigin: "top",
			})} ${className}`}
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
