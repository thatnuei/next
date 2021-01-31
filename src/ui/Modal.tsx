import { css } from "@emotion/react"
import { motion } from "framer-motion"
import { MouseEvent } from "react"
import * as React from "react"
import tw from "twin.macro"
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

	const shadeStyle = [
		tw`flex flex-col p-4 bg-black-faded`,

		verticalPanelAlign === "top" && tw`items-center justify-start`,
		verticalPanelAlign === "middle" && tw`items-center justify-center`,

		fillMode === "contained" && absoluteCover,
		fillMode === "fullscreen" && fixedCover,
	]

	const panelStyle = [
		raisedPanel,
		tw`flex flex-col w-full h-full`,
		css({ maxWidth: props.width }),
		css({ maxHeight: props.height }),
	]

	const closeButtonStyle = [
		fadedButton,
		tw`absolute top-0 bottom-0 right-0 flex items-center justify-center w-16`,
	]

	const content = (
		<motion.div
			css={shadeStyle}
			onPointerDown={handleShadeClick}
			{...fadeAnimation}
		>
			<motion.div css={panelStyle} {...slideAnimation}>
				<header css={[raisedPanelHeader, tw`relative px-16 text-center`]}>
					<h1 css={headerText}>{props.title}</h1>
					<Button css={closeButtonStyle} onClick={props.onDismiss}>
						<Icon which={close} />
					</Button>
				</header>
				<main css={tw`flex-1 min-h-0`}>{props.children}</main>
			</motion.div>
		</motion.div>
	)

	return fillMode === "fullscreen" ? <Portal>{content}</Portal> : content
}

export default Modal
