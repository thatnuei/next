import { motion } from "framer-motion"
import { useRef } from "react"
import * as React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import * as icons from "../ui/icons"
import { fadeAnimation } from "./animation"
import { fadedButton } from "./components"
import { fixedCover } from "./helpers"
import Icon from "./Icon"
import { OverlayProps } from "./overlay"

type Props = Partial<OverlayProps> & {
	children: React.ReactNode
	side: "left" | "right"
}

function Drawer({ isVisible, onDismiss, side, children }: Props) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)

	const handleShadeClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			onDismiss?.()
		}
	}

	const shadeStyle = [fixedCover, tw`bg-black-faded`]

	const contentContainerStyle = [
		tw`absolute top-0 bottom-0 flex items-start`,
		side === "left" && tw`left-0`,
		side === "right" && tw`right-0`,
	]

	const panelVariants = {
		out: {
			x: side === "left" ? -100 : 100,
			transition: { type: "tween", duration: 0.3, ease: "easeIn" },
		},
		in: {
			x: 0,
			transition: { type: "tween", duration: 0.3 },
		},
	}

	const closeButton = (
		<Button
			title="close"
			css={[fadedButton, tw`p-2`]}
			onClick={onDismiss}
			ref={closeButtonRef}
		>
			<Icon which={icons.close} />
		</Button>
	)

	return (
		<motion.div css={shadeStyle} onClick={handleShadeClick} {...fadeAnimation}>
			<motion.div
				css={contentContainerStyle}
				variants={panelVariants}
				initial="out"
				animate="in"
				exit="out"
			>
				{side === "right" && closeButton}
				<div css={tw`h-full shadow-normal`}>{children}</div>
				{side === "left" && closeButton}
			</motion.div>
		</motion.div>
	)
}

export default Drawer
