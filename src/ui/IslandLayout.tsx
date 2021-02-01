import { motion } from "framer-motion"
import * as React from "react"
import { tw } from "twind"
import { ChildrenProps } from "../jsx/types"
import { fadeAnimation, slideAnimation } from "./animation"
import { headerText, raisedPanel, raisedPanelHeader } from "./components"
import { centerItems, fixedCover, flexColumn } from "./helpers"

export default function IslandLayout(
	props: ChildrenProps & { title: React.ReactNode },
) {
	return (
		<motion.div
			className={tw(fixedCover, flexColumn, centerItems)}
			{...fadeAnimation}
		>
			<motion.div className={raisedPanel} {...slideAnimation}>
				<header className={raisedPanelHeader}>
					<h1 className={headerText}>{props.title}</h1>
				</header>
				{props.children}
			</motion.div>
		</motion.div>
	)
}
