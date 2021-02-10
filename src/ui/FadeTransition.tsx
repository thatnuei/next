import { Transition, TransitionClasses } from "@headlessui/react"
import { ReactNode } from "react"
import { theme, tw } from "twind"
import { css } from "twind/css"

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
			enter={tw`transition-opacity ${delayedEntry && delayedEntryCss}`}
			enterFrom={tw`opacity-0`}
			enterTo={tw`opacity-100`}
			leave={tw`transition-opacity`}
			leaveFrom={tw`opacity-100`}
			leaveTo={tw`opacity-0`}
			{...props}
		>
			{children}
		</Transition>
	)
}

const delayedEntryCss = css({
	transitionDelay: theme("transitionDuration.DEFAULT"),
})
