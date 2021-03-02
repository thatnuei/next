import * as React from "react"
import { tw } from "twind"
import { css } from "twind/css"
import { ChildrenProps } from "../jsx/types"
import { headerText, raisedPanel, raisedPanelHeader } from "./components"
import FadeRiseTransition from "./FadeRiseTransition"

export default function IslandLayout(
	props: ChildrenProps & { title: React.ReactNode; isVisible: boolean },
) {
	return (
		<FadeRiseTransition
			className={tw`fixed inset-0 flex flex-col items-center justify-center`}
			isVisible={props.isVisible}
			enter={tw(css({ transitionDelay: "300ms" }))} // wait for the previous island to disappear
		>
			<div tw={raisedPanel}>
				<header tw={raisedPanelHeader}>
					<h1 tw={headerText}>{props.title}</h1>
				</header>
				{props.children}
			</div>
		</FadeRiseTransition>
	)
}
