import * as React from "react"
import { ChildrenProps } from "../jsx/types"
import { headerText, raisedPanel, raisedPanelHeader } from "./components"
import FadeRiseTransition from "./FadeRiseTransition"

export default function IslandLayout(
	props: ChildrenProps & { title: React.ReactNode; isVisible: boolean },
) {
	return (
		<FadeRiseTransition
			className="fixed inset-0 flex flex-col items-center justify-center"
			isVisible={props.isVisible}
			enter="transition-delay-300" // wait for the previous island to disappear
		>
			<div className={raisedPanel}>
				<header className={raisedPanelHeader}>
					<h1 className={headerText}>{props.title}</h1>
				</header>
				{props.children}
			</div>
		</FadeRiseTransition>
	)
}
