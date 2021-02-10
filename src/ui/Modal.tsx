import { motion } from "framer-motion"
import * as React from "react"
import { MouseEvent } from "react"
import { tw } from "twind"
import { css } from "twind/css"
import Button from "../dom/Button"
import Portal from "../react/Portal"
import { fadeAnimation, slideAnimation } from "./animation"
import {
	fadedButton,
	headerText,
	raisedPanel,
	raisedPanelHeader,
} from "./components"
import { absoluteCover, fixedCover } from "./helpers"
import Icon from "./Icon"
import { close } from "./icons"

type Props = {
	title: string
	width: number | string
	height: number | string
	fillMode?: "fullscreen" | "contained"
	verticalPanelAlign?: "top" | "middle"
	children?: React.ReactNode
	onDismiss: () => void
}

function Modal({
	fillMode = "fullscreen",
	verticalPanelAlign = "middle",
	...props
}: Props) {
	const handleShadeClick = (event: MouseEvent) => {
		if (event.target === event.currentTarget) {
			props.onDismiss()
		}
	}

	const shadeStyle = tw(
		tw`flex flex-col p-4 bg-black bg-opacity-50`,

		verticalPanelAlign === "top" && tw`items-center justify-start`,
		verticalPanelAlign === "middle" && tw`items-center justify-center`,

		fillMode === "contained" && absoluteCover,
		fillMode === "fullscreen" && fixedCover,
	)

	const panelStyle = tw(
		raisedPanel,
		`flex flex-col w-full h-full`,
		// @ts-expect-error
		css({ maxWidth: props.width }),
		// @ts-expect-error
		css({ maxHeight: props.height }),
	)

	const closeButtonStyle = tw(
		fadedButton,
		`absolute top-0 bottom-0 right-0 flex items-center justify-center w-16`,
	)

	const content = (
		<motion.div
			className={shadeStyle}
			onPointerDown={handleShadeClick}
			{...fadeAnimation}
		>
			<motion.div className={panelStyle} {...slideAnimation}>
				<header
					className={tw([raisedPanelHeader, tw`relative px-16 text-center`])}
				>
					<h1 className={headerText}>{props.title}</h1>
					<Button className={closeButtonStyle} onClick={props.onDismiss}>
						<Icon which={close} />
					</Button>
				</header>
				<main className={tw`flex-1 min-h-0`}>{props.children}</main>
			</motion.div>
		</motion.div>
	)

	return fillMode === "fullscreen" ? <Portal>{content}</Portal> : content
}

export default Modal
