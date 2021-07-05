import type { TransitionClasses } from "@headlessui/react"
import { Transition } from "@headlessui/react"
import type { ReactNode } from "react"

export function createTransitionComponent({
	enter = `transition duration-300`,
	enterFrom,
	enterTo,
	leave = enter,
	leaveFrom = enterTo,
	leaveTo = enterFrom,
}: TransitionClasses) {
	return function TransitionComponent({
		show,
		children,
		className,
		child,
	}: {
		children: ReactNode
		show?: boolean
		child?: boolean
		className?: string
	}) {
		const props = {
			className,
			enter,
			enterFrom,
			enterTo,
			leave,
			leaveFrom,
			leaveTo,
		}

		return child ? (
			// @ts-expect-error: fix this later
			<Transition.Child {...props}>{children}</Transition.Child>
		) : (
			// @ts-expect-error: fix this later
			<Transition show={show ?? false} {...props}>
				{children}
			</Transition>
		)
	}
}
