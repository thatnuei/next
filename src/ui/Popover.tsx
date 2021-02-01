import composeRefs from "@seznam/compose-react-refs"
import { HTMLMotionProps, motion } from "framer-motion"
import * as React from "react"
import { useCallback, useState } from "react"
import FocusLock from "react-focus-lock"
import { tw } from "twind"
import { useElementSize } from "../dom/useElementSize"
import { useWindowEvent } from "../dom/useWindowEvent"
import { useWindowSize } from "../dom/useWindowSize"
import Portal from "../react/Portal"
import { fadeSlideAnimation } from "./animation"
import { useOverlay } from "./overlay"

export type PopoverProps = HTMLMotionProps<"div"> & {
	onDismiss: () => void
	position: PopoverPosition
	children: React.ReactNode
}

type PopoverPosition = { x: number; y: number }

const edgeSpacing = 12

function Popover({ children, position, onDismiss, ...props }: PopoverProps) {
	const [container, setContainer] = useState<HTMLElement | null>()
	const containerSize = useElementSize(container)
	const windowSize = useWindowSize()

	const clickOutsideRef = useClickOutside(onDismiss)

	useWindowEvent("keydown", (event) => {
		if (event.key === "Escape") onDismiss()
	})

	const left = Math.max(
		Math.min(position.x, windowSize.width - containerSize.width - edgeSpacing),
		edgeSpacing,
	)

	const top = Math.max(
		Math.min(
			position.y,
			windowSize.height - containerSize.height - edgeSpacing,
		),
		edgeSpacing,
	)

	const containerStyle = tw(
		tw`fixed overflow-y-auto shadow-normal bg-background-1`,
		{ left, top, maxHeight: `calc(100vh - ${edgeSpacing * 2}px)` },
	)

	return (
		<Portal>
			<FocusLock returnFocus>
				<motion.div
					data-auto-focus
					className={containerStyle}
					{...fadeSlideAnimation}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					ref={composeRefs(setContainer, clickOutsideRef as any) as any}
					{...props}
				>
					{children}
				</motion.div>
			</FocusLock>
		</Portal>
	)
}

export default Popover

export function usePopover() {
	const state = useOverlay()
	const [position, setPosition] = useState({ x: 0, y: 0 })

	const { show } = state
	const showAt = useCallback(
		(position: PopoverPosition) => {
			setPosition(position)
			show()
		},
		[show],
	)

	// TODO: add another callback which accepts an element,
	// then shows the popover at that element's position,
	// possibly accepting a position/alignment option
	// for easier context menus with button triggers

	return { ...state, showAt, props: { onDismiss: state.hide, position } }
}

function useClickOutside(callback: () => void) {
	const [element, setElement] = useState<Element | null>()

	useWindowEvent("click", (event) => {
		const clickedInsideElement = event
			.composedPath()
			.some((el) => el === element)

		if (!clickedInsideElement) callback()
	})

	return setElement
}
