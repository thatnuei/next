import { motion } from "framer-motion"
import * as React from "react"
import { ChildrenProps } from "../jsx/types"
import { fadeAnimation, slideAnimation } from "./animation"
import { headerText, raisedPanel, raisedPanelHeader } from "./components"
import { centerItems, fixedCover, flexColumn } from "./helpers"

export default function IslandLayout(
	props: ChildrenProps & { title: React.ReactNode },
) {
	return (
		<motion.div css={[fixedCover, flexColumn, centerItems]} {...fadeAnimation}>
			<motion.div css={raisedPanel} {...slideAnimation}>
				<header css={raisedPanelHeader}>
					<h1 css={headerText}>{props.title}</h1>
				</header>
				{props.children}
			</motion.div>
		</motion.div>
	)
}
