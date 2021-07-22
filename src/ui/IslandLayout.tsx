import * as React from "react"
import type { ChildrenProps } from "../jsx/types"
import { headerText, raisedPanel, raisedPanelHeader } from "./components"
import FadeRiseTransition from "./FadeRiseTransition"

export default function IslandLayout(
	props: ChildrenProps & {
		title: React.ReactNode
		isVisible: boolean
		footer?: React.ReactNode
	},
) {
	return (
		<FadeRiseTransition
			className="fixed inset-0 flex flex-col items-center justify-center"
			show={props.isVisible}
		>
			<div className={raisedPanel}>
				<header className={raisedPanelHeader}>
					<h1 className={headerText}>{props.title}</h1>
				</header>
				{props.children}
			</div>
			<div className="max-w-sm px-4 mt-4 text-center">{props.footer}</div>
		</FadeRiseTransition>
	)
}
